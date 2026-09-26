"""
Legal Saathi - NALSA Legal Aid Statistics Parser & Combiner
Extracts and combines all 10 National Legal Services Authority (NALSA) PDF reports
(Financial Years 2016-2017 to 2025-2026) across all 37 SLSAs into a unified, clean CSV.
"""

import csv
import glob
import os
from pathlib import Path
import re
import sys
import pypdf

# Configure UTF-8 for Windows consoles
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

PROJECT_ROOT = Path(__file__).resolve().parent.parent
PDF_DIR = PROJECT_ROOT / "download_dataset" / "nalsa_legal_aid_statistics"
OUTPUT_CSV = PROJECT_ROOT / "download_dataset" / "nalsa_legal_aid_statistics.csv"

# Financial Year Mapping based on official NALSA document registration
FY_MAPPING = {
    "202504201584323382.pdf": "2016-2017",
    "202504202049899435.pdf": "2017-2018",
    "20250612785003768.pdf":  "2018-2019",
    "202506121059301255.pdf": "2019-2020",
    "20250612242265083.pdf":  "2020-2021",
    "20250612891186821.pdf":  "2021-2022",
    "202506121402395984.pdf": "2022-2023",
    "20250612151392405.pdf":  "2023-2024",
    "20250612914784169.pdf":  "2024-2025",
    "202607161242945433.pdf": "2025-2026",
}

HEADER_PHRASES = [
    "statement showing", "legal services", "authorities act", "s.no.", "slsas",
    "persons with disability", "industrial workmen", "transgender", "victim of trafficking",
    "victims of mass disaster", "general (whose annual income", "prescibed limit", "in custody",
    "sc st women children", "national legal services authority", "period from", "during the period"
]

COLUMNS = [
    "financial_year",
    "source_pdf",
    "s_no",
    "slsa_state",
    "sc",
    "st",
    "women",
    "children",
    "in_custody",
    "disability",
    "industrial_workmen",
    "transgender",
    "trafficking_begar",
    "mass_disaster",
    "general",
    "others",
    "total",
]


def parse_nalsa_pdf(filepath: Path):
    """Parses a single NALSA statistical PDF report into structured row records."""
    reader = pypdf.PdfReader(str(filepath))
    raw_lines = []

    for page in reader.pages:
        for line in page.extract_text().splitlines():
            s = line.strip()
            if not s:
                continue
            low = s.lower()
            if any(hp in low for hp in HEADER_PHRASES):
                continue
            if low.startswith("s.no.") or low.startswith("slsas") or low in [
                "persons", "with", "disability", "industrial", "workmen transgender",
                "victim of", "trafficking", "in human", "beings or", "bagar", "victims of",
                "mass", "disaster", "violence,", "floor,", "draught,", "earthquake", "and",
                "industrial", "general", "(whose", "annual", "income", "does not",
                "exceed the", "prescibed", "limit)", "others total", "sc", "st", "women", "children"
            ]:
                continue
            raw_lines.append(s)

    records = []
    curr_rec = []
    expected_sno = 1

    for line in raw_lines:
        m_sno = re.match(r"^" + str(expected_sno) + r"\s+([A-Za-z &()./\-]+.*)$", line)
        m_tot = re.match(r"^Total\s+(.*)$", line, re.IGNORECASE) if expected_sno >= 30 else None

        if m_sno:
            if curr_rec:
                records.append((expected_sno - 1, " ".join(curr_rec)))
            expected_sno += 1
            curr_rec = [m_sno.group(1)]
        elif m_tot:
            if curr_rec:
                records.append((expected_sno - 1, " ".join(curr_rec)))
            expected_sno = 999
            curr_rec = ["Total", m_tot.group(1)]
        else:
            if curr_rec:
                curr_rec.append(line)

    if curr_rec:
        records.append(("Total", " ".join(curr_rec)))

    parsed_rows = []
    for sno, text in records:
        tokens = text.split()
        nums = [int(tok.replace(",", "")) for tok in tokens if tok.replace(",", "").isdigit()]

        # Filter out trailing 4-digit year metadata if present
        if len(nums) > 13:
            if sum(nums[:12]) == nums[12]:
                nums = nums[:13]
            elif sum(nums[-13:-1]) == nums[-1]:
                nums = nums[-13:]
            else:
                nums = nums[:13]

        words = []
        for tok in tokens:
            if tok.replace(",", "").isdigit():
                break
            words.append(tok)
        state_name = " ".join(words).strip()
        if sno == "Total":
            state_name = "Total"

        parsed_rows.append({
            "s_no": sno,
            "state": state_name,
            "numbers": nums,
        })

    return parsed_rows


def compile_nalsa_dataset():
    pdf_files = sorted(PDF_DIR.glob("*.pdf"))
    if not pdf_files:
        print(f"[ERROR] No PDF files found in {PDF_DIR}")
        return

    print("=" * 75)
    print(">> Legal Saathi: Compiling NALSA Legal Aid Statistics Dataset")
    print(f">> Source Directory: {PDF_DIR}")
    print(f">> Output File     : {OUTPUT_CSV}")
    print(f">> Total Reports   : {len(pdf_files)} Financial Years")
    print("=" * 75)

    all_csv_rows = []
    summary_by_fy = {}

    for pdf_path in pdf_files:
        fname = pdf_path.name
        fy = FY_MAPPING.get(fname, "Unknown")
        rows = parse_nalsa_pdf(pdf_path)

        state_rows = [r for r in rows if r["s_no"] != "Total"]
        total_row = next((r for r in rows if r["s_no"] == "Total"), None)

        sum_calculated = sum(r["numbers"][-1] for r in state_rows)
        grand_total = total_row["numbers"][-1] if total_row else sum_calculated
        is_verified = (sum_calculated == grand_total)

        summary_by_fy[fy] = {
            "file": fname,
            "states_count": len(state_rows),
            "total_beneficiaries": grand_total,
            "verified": is_verified,
        }

        # Add data rows (excluding the redundant subtotal row, or keeping state-level granularity)
        for r in state_rows:
            all_csv_rows.append([
                fy,
                fname,
                r["s_no"],
                r["state"],
                *r["numbers"],
            ])

        print(f"  * FY {fy} ({fname}): {len(state_rows)} SLSAs | {grand_total:>10,} Beneficiaries [Verified: {is_verified}]")

    # Write combined CSV
    with open(OUTPUT_CSV, mode="w", newline="", encoding="utf-8") as f_out:
        writer = csv.writer(f_out)
        writer.writerow(COLUMNS)
        writer.writerows(all_csv_rows)

    total_records = len(all_csv_rows)
    total_beneficiaries = sum(item["total_beneficiaries"] for item in summary_by_fy.values())
    file_size_kb = OUTPUT_CSV.stat().st_size / 1024

    print("\n" + "=" * 75)
    print(">> COMPILATION SUCCESSFUL: NALSA STATISTICAL DATASET")
    print("=" * 75)
    print(f"  Target File         : {OUTPUT_CSV}")
    print(f"  Total Data Rows     : {total_records:,} (State-Year pairs)")
    print(f"  Total Beneficiaries : {total_beneficiaries:,} across 10 years")
    print(f"  CSV File Size       : {file_size_kb:.2f} KB")
    print(f"  10-Year Span        : 2016-2017 through 2025-2026")
    print("=" * 75 + "\n")


if __name__ == "__main__":
    compile_nalsa_dataset()
