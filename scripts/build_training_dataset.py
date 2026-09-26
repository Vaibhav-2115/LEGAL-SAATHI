"""
Legal Saathi — Dataset Ingestion & Instruction Tuning Dataset Generator
Converts structured files in dataset/ into high-quality instruction-tuning pairs
for fine-tuning LLMs (Llama, Mistral, Gemma, Gemini) and RAG indexing.
"""

import csv
import json
import os
from pathlib import Path
import sys

# Configure UTF-8 encoding for Windows terminals
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

ROOT_DIR = Path(__file__).resolve().parent.parent
DATASET_DIR = ROOT_DIR / "dataset"
OUTPUT_DIR = ROOT_DIR / "data" / "training"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

SYSTEM_PROMPT = (
    "You are Legal Saathi, a precise Indian legal AI assistant. "
    "You provide clear, accurate guidance on Indian statutes, court procedures, "
    "criminal law transitions (IPC/CrPC/IEA to BNS/BNSS/BSA), and free legal aid (NALSA). "
    "Always state jurisdiction, current legal validity, and exact section citations."
)


def build_transition_instruction_pairs():
    """Generates instruction pairs from dataset/mapping.csv (old to new laws)."""
    mapping_csv = DATASET_DIR / "mapping.csv"
    if not mapping_csv.exists():
        return []

    pairs = []
    act_names = {
        "ipc": "Indian Penal Code, 1860 (IPC)",
        "crpc": "Code of Criminal Procedure, 1973 (CrPC)",
        "iea": "Indian Evidence Act, 1872 (IEA)",
        "bns": "Bharatiya Nyaya Sanhita, 2023 (BNS)",
        "bnss": "Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)",
        "bsa": "Bharatiya Sakshya Adhiniyam, 2023 (BSA)",
        "income-tax-act": "Income-tax Act, 1961",
        "income-tax-act-2025": "Income-tax Act, 2025",
    }

    with open(mapping_csv, "r", encoding="utf-8", errors="ignore") as fp:
        reader = csv.DictReader(fp)
        for row in reader:
            from_act = row.get("from_act", "").strip().lower()
            to_act = row.get("to_act", "").strip().lower()
            from_num = row.get("from_num", "").strip()
            to_num = row.get("to_num", "").strip()
            from_heading = row.get("from_heading", "").strip()
            to_heading = row.get("to_heading", "").strip()
            relation = row.get("relation", "").strip()
            score = row.get("score", "").strip()

            if not from_act or not to_act or not from_num or not to_num:
                continue

            from_full = act_names.get(from_act, from_act.upper())
            to_full = act_names.get(to_act, to_act.upper())

            user_query = (
                f"What is the equivalent section in the new law for Section {from_num} "
                f"of {from_full} ('{from_heading}')?"
            )

            assistant_response = (
                f"Under the new legal framework in India, Section {from_num} of {from_full} "
                f"('{from_heading}') corresponds to **Section {to_num}** of **{to_full}** "
                f"('{to_heading}').\n\n"
                f"- **Statutory Relation**: {relation.capitalize()} (Alignment Score: {score})\n"
                f"- **Applicability**: For offences committed on or after July 1, 2024, "
                f"proceedings and charges must be framed under {to_full} Section {to_num}. "
                f"Offences committed prior to July 1, 2024 remain governed by {from_full} Section {from_num}."
            )

            pairs.append({
                "category": "law_transition",
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_query},
                    {"role": "assistant", "content": assistant_response},
                ],
                "metadata": {
                    "source": "mapping.csv",
                    "from_act": from_act,
                    "to_act": to_act,
                    "from_num": from_num,
                    "to_num": to_num
                }
            })

    return pairs


def build_repeal_guardrail_pairs(limit: int = 1500):
    """Generates safety guardrail instruction pairs from dataset/repeals.csv."""
    repeals_csv = DATASET_DIR / "repeals.csv"
    if not repeals_csv.exists():
        return []

    pairs = []
    with open(repeals_csv, "r", encoding="utf-8", errors="ignore") as fp:
        reader = csv.DictReader(fp)
        for i, row in enumerate(reader):
            if i >= limit:
                break
            title = row.get("title", "").strip().strip('"')
            repealed_by = row.get("repealed_by", "").strip()
            year = row.get("year", "").strip()

            if not title or len(title) < 5:
                continue

            user_query = f"Is the statute '{title}' currently active and enforceable in India?"

            rep_info = f" by {repealed_by}" if repealed_by else ""
            assistant_response = (
                f"No, **{title}** is **repealed and no longer active law** in India.\n\n"
                f"- **Original Year**: {year or 'Historical'}\n"
                f"- **Status**: Repealed{rep_info}\n"
                f"- **Legal Safeguard**: Per Section 6 of the Indian statutory legal framework, "
                f"repealed enactments cannot be used to establish rights, liabilities, or criminal penalties "
                f"for current actions. Refer to the corresponding contemporary Central or State enactment."
            )

            pairs.append({
                "category": "repealed_statute_guardrail",
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_query},
                    {"role": "assistant", "content": assistant_response},
                ],
                "metadata": {
                    "source": "repeals.csv",
                    "title": title,
                    "year": year,
                    "repealed_by": repealed_by
                }
            })

    return pairs


def build_legal_aid_instruction_pairs():
    """Generates NALSA / SLSA free legal aid instruction pairs based on the SLSA schedules in dataset/."""
    # Extracted from the 10 SLSA schedule PDFs in dataset/
    slsa_data = [
        {"state": "Delhi", "limit": "₹3,00,000", "authority": "Delhi State Legal Services Authority (DSLSA)"},
        {"state": "Maharashtra", "limit": "₹3,00,000", "authority": "Maharashtra State Legal Services Authority (MSLSA)"},
        {"state": "Uttar Pradesh", "limit": "₹1,50,000", "authority": "Uttar Pradesh State Legal Services Authority (UPSLSA)"},
        {"state": "Karnataka", "limit": "₹3,00,000", "authority": "Karnataka State Legal Services Authority (KSLSA)"},
        {"state": "West Bengal", "limit": "₹1,50,000", "authority": "West Bengal State Legal Services Authority (WBSLSA)"},
        {"state": "Tamil Nadu", "limit": "₹3,00,000", "authority": "Tamil Nadu State Legal Services Authority (TNSLSA)"},
        {"state": "Rajasthan", "limit": "₹1,50,000", "authority": "Rajasthan State Legal Services Authority (RSLSA)"},
        {"state": "Bihar", "limit": "₹1,50,000", "authority": "Bihar State Legal Services Authority (BSLSA)"},
        {"state": "Madhya Pradesh", "limit": "₹1,50,000", "authority": "Madhya Pradesh State Legal Services Authority (MPSLSA)"},
        {"state": "Gujarat", "limit": "₹1,50,000", "authority": "Gujarat State Legal Services Authority (GSLSA)"},
        {"state": "Punjab & Haryana", "limit": "₹3,00,000", "authority": "Punjab & Haryana Legal Services Authorities"}
    ]

    pairs = []
    for item in slsa_data:
        state = item["state"]
        limit = item["limit"]
        auth = item["authority"]

        query = f"Who is eligible for free legal aid in {state}, and what is the income limit?"
        response = (
            f"Under Section 12 of the Legal Services Authorities Act, 1987, and regulations issued by **{auth}**, "
            f"free legal aid is provided to the following categories:\n\n"
            f"### Categorical Eligibility (No Income Limit):\n"
            f"1. Members of Scheduled Castes (SC) or Scheduled Tribes (ST)\n"
            f"2. Women and Children\n"
            f"3. Persons with disabilities (mental or physical)\n"
            f"4. Persons in judicial or police custody\n"
            f"5. Victims of human trafficking or begar\n"
            f"6. Industrial workmen\n"
            f"7. Victims of mass disasters, ethnic violence, floods, drought, earthquake, or industrial disaster\n\n"
            f"### General Category (Income Threshold):\n"
            f"- For individuals not in the exempt categories, the annual household income in **{state}** must not exceed **{limit}**.\n\n"
            f"### How to Apply:\n"
            f"- Visit your District Legal Services Authority (DLSA) office located in the District Court premises.\n"
            f"- Call the National Legal Aid Toll-Free Helpline: **15100**.\n"
            f"- Apply online via the NALSA Legal Aid Portal (`nalsa.gov.in`)."
        )

        pairs.append({
            "category": "legal_aid_nalsa",
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": query},
                {"role": "assistant", "content": response},
            ],
            "metadata": {
                "source": "SLSA Performa E",
                "state": state,
                "annual_income_limit": limit,
                "authority": auth
            }
        })

    return pairs


def build_acts_grounding_pairs(limit: int = 1500):
    """Generates statutory metadata instruction pairs from dataset/acts.csv."""
    acts_csv = DATASET_DIR / "acts.csv"
    if not acts_csv.exists():
        return []

    pairs = []
    with open(acts_csv, "r", encoding="utf-8", errors="ignore") as fp:
        reader = csv.DictReader(fp)
        for i, row in enumerate(reader):
            if i >= limit:
                break
            short_title = row.get("short_title", "").strip()
            act_num = row.get("act_number", "").strip()
            act_year = row.get("act_year", "").strip()
            jurisdiction = row.get("jurisdiction", "").strip()
            ministry = row.get("ministry", "").strip()
            sec_count = row.get("section_count", "").strip()
            enact_date = row.get("enact_date", "").strip()

            if not short_title or len(short_title) < 5:
                continue

            query = f"Can you provide the official details, jurisdiction, and structure of '{short_title}'?"

            parts = [f"**{short_title}** is an enacted statute in India."]
            if act_num and act_year:
                parts.append(f"- **Act Number**: Act No. {act_num} of {act_year}")
            if jurisdiction:
                parts.append(f"- **Jurisdiction**: {jurisdiction}")
            if ministry:
                parts.append(f"- **Nodal Ministry**: {ministry}")
            if enact_date:
                parts.append(f"- **Enactment Date**: {enact_date}")
            if sec_count:
                parts.append(f"- **Section Count**: {sec_count} sections")

            parts.append(
                "\nTo review specific sections, cite the relevant section number or request the procedural rules applicable under this Act."
            )

            response = "\n".join(parts)

            pairs.append({
                "category": "act_metadata",
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": query},
                    {"role": "assistant", "content": response},
                ],
                "metadata": {
                    "source": "acts.csv",
                    "act_id": row.get("id", ""),
                    "jurisdiction": jurisdiction
                }
            })

    return pairs


def generate_all_training_data():
    print("=" * 65)
    print(">> Legal Saathi: Generating Instruction Tuning Dataset from dataset/")
    print("=" * 65)

    all_pairs = []

    # 1. New vs Old Criminal Law Mappings (2,055 records)
    print("\n[1/4] Processing law transitions from mapping.csv...")
    transition_pairs = build_transition_instruction_pairs()
    print(f"      Generated {len(transition_pairs)} transition instruction pairs.")
    all_pairs.extend(transition_pairs)

    # 2. Free Legal Aid / SLSA Proforma Rules
    print("\n[2/4] Processing legal aid & NALSA eligibility from SLSA documents...")
    legal_aid_pairs = build_legal_aid_instruction_pairs()
    print(f"      Generated {len(legal_aid_pairs)} legal aid instruction pairs.")
    all_pairs.extend(legal_aid_pairs)

    # 3. Repealed Statute Safeguards (1,500 records)
    print("\n[3/4] Processing repealed law guardrails from repeals.csv...")
    repeal_pairs = build_repeal_guardrail_pairs(limit=1500)
    print(f"      Generated {len(repeal_pairs)} repeal guardrail pairs.")
    all_pairs.extend(repeal_pairs)

    # 4. Enacted Acts Metadata (1,500 records)
    print("\n[4/4] Processing statutory metadata from acts.csv...")
    acts_pairs = build_acts_grounding_pairs(limit=1500)
    print(f"      Generated {len(acts_pairs)} statutory metadata pairs.")
    all_pairs.extend(acts_pairs)

    # Write output files
    jsonl_file = OUTPUT_DIR / "legal_saathi_sft_train.jsonl"
    with open(jsonl_file, "w", encoding="utf-8") as fp:
        for p in all_pairs:
            # Standard OpenAI / Hugging Face / Gemini chat format
            fp.write(json.dumps({"messages": p["messages"]}, ensure_ascii=False) + "\n")

    json_file = OUTPUT_DIR / "legal_saathi_sft_full.json"
    with open(json_file, "w", encoding="utf-8") as fp:
        json.dump(all_pairs, fp, ensure_ascii=False, indent=2)

    print("\n" + "=" * 65)
    print(f"[COMPLETED] Total Instruction Tuning Samples Generated: {len(all_pairs)}")
    print(f"  - Chat JSONL (for fine-tuning): {jsonl_file}")
    print(f"  - Full JSON with metadata:     {json_file}")
    print("=" * 65)


if __name__ == "__main__":
    generate_all_training_data()
