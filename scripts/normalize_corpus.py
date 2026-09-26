"""
Legal Saathi - Master Corpus Normalizer & Deduplicator (scripts/normalize_corpus.py)
Executes Part 5 (Deduplication Strategy) & Part 6 (Canonical Schema Normalization)
per the Dataset Acquisition Plan and Dataset Specification v1.0.

Outputs:
- data/normalized/legislation_canonical.json
- data/normalized/judgments_canonical.json
- data/normalized/legal_aid_canonical.json
- data/normalized/incident_clusters_canonical.json
- data/normalized/master_canonical_corpus.json
"""

import csv
import hashlib
import json
import os
import re
from typing import Any, Dict, List, Optional, Set
import pyarrow.parquet as pq

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
RAW_DIR = os.path.join(DATA_DIR, "raw")
NORMALIZED_DIR = os.path.join(DATA_DIR, "normalized")


def compute_text_hash(text: str) -> str:
    """Computes SHA-256 hash of whitespace-normalized lowercase text."""
    normalized = " ".join(text.lower().split())
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()


class CorpusNormalizer:
    def __init__(self):
        self.seen_exact_hashes: Set[str] = set()
        self.seen_citation_keys: Set[str] = set()
        self.legislation_records: List[Dict[str, Any]] = []
        self.judgment_records: List[Dict[str, Any]] = []
        self.legal_aid_records: List[Dict[str, Any]] = []
        self.incident_records: List[Dict[str, Any]] = []
        self.duplicate_count = 0

    def is_duplicate(self, text: str, citation_key: Optional[str] = None) -> bool:
        """Applies exact hash and near-duplicate citation matching per Part 5."""
        if not text or len(text.strip()) < 10:
            return True

        h = compute_text_hash(text)
        if h in self.seen_exact_hashes:
            self.duplicate_count += 1
            return True
        self.seen_exact_hashes.add(h)

        if citation_key:
            ck = citation_key.lower().strip()
            if ck in self.seen_citation_keys:
                self.duplicate_count += 1
                return True
            self.seen_citation_keys.add(ck)

        return False

    def normalize_civictech_bare_acts(self):
        """Normalizes CivicTech India Bare Acts (IPC, CrPC, CPC, IEA, NIA, MVA, HMA, IDA)."""
        print("\n--- Normalizing CivicTech Bare Acts ---")
        act_mapping = {
            "ipc.json": ("Indian Penal Code, 1860", "IPC", "superseded", "Offences committed prior to 2024-07-01; succeeded by Bharatiya Nyaya Sanhita (BNS, 2023)"),
            "crpc.json": ("Code of Criminal Procedure, 1973", "CrPC", "superseded", "Procedural law prior to 2024-07-01; succeeded by Bharatiya Nagarik Suraksha Sanhita (BNSS, 2023)"),
            "cpc.json": ("Code of Civil Procedure, 1908", "CPC", "current", "Governs administration of civil proceedings across India"),
            "iea.json": ("Indian Evidence Act, 1872", "IEA", "superseded", "Evidentiary rules prior to 2024-07-01; succeeded by Bharatiya Sakshya Adhiniyam (BSA, 2023)"),
            "nia.json": ("Negotiable Instruments Act, 1881", "NIA", "current", "Governs promissory notes, bills of exchange, and Section 138 cheque bounce proceedings"),
            "mva.json": ("Motor Vehicles Act, 1988", "MVA", "current", "Governs road transport, licensing, liability and MACT accident compensation claims"),
            "hma.json": ("Hindu Marriage Act, 1955", "HMA", "current", "Governs marriage, restitution of conjugal rights, judicial separation, and divorce for Hindus"),
            "ida.json": ("Indian Divorce Act, 1869", "IDA", "current", "Governs divorce and matrimonial causes for Christians in India")
        }

        leg_dir = os.path.join(RAW_DIR, "legislation")
        for filename, (formal_title, act_abbr, status, note) in act_mapping.items():
            path = os.path.join(leg_dir, filename)
            if not os.path.exists(path):
                continue

            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)

            act_records = 0
            for item in data:
                if "chapter,section,section_title,section_desc" in item:
                    line = item["chapter,section,section_title,section_desc"]
                    if not line or not line.strip():
                        continue
                    parts = list(csv.reader([line]))[0]
                    if len(parts) >= 4:
                        sec_raw = parts[1]
                        sec_title = parts[2]
                        sec_desc = parts[3]
                    elif len(parts) >= 3:
                        sec_raw = parts[1]
                        sec_title = parts[2]
                        sec_desc = parts[2]
                    else:
                        continue
                else:
                    sec_raw = item.get("Section") or item.get("section") or ""
                    sec_title = item.get("section_title") or item.get("title") or ""
                    sec_desc = item.get("section_desc") or item.get("description") or item.get("desc") or item.get("text") or ""

                if not sec_desc or len(str(sec_desc).strip()) < 5:
                    continue

                citation_key = f"{act_abbr}_Sec_{sec_raw}"
                if self.is_duplicate(sec_desc, citation_key):
                    continue

                doc_id = f"act_{act_abbr.lower()}_sec_{str(sec_raw).replace('/', '_')}"
                record = {
                    "document_id": doc_id,
                    "document_type": "act_section",
                    "title": f"{formal_title} - Section {sec_raw}: {sec_title}",
                    "jurisdiction": "India (Central)",
                    "state": "Central",
                    "court": None,
                    "language": "en",
                    "date": "1974-04-01" if act_abbr == "CrPC" else ("1860-10-06" if act_abbr == "IPC" else "1882-03-01"),
                    "act": formal_title,
                    "section": f"Section {sec_raw}",
                    "case_number": None,
                    "citation": f"{formal_title}, Section {sec_raw}",
                    "text": f"{formal_title} - Section {sec_raw}: {sec_title}\n\n{sec_desc}",
                    "summary": f"{sec_title}. Statutory provision under {formal_title} ({status}). {note}",
                    "source_url": "https://www.indiacode.nic.in",
                    "source_dataset": "CivicTech India Bare Acts",
                    "license": "Government / Public Domain (Copyright Act §52(1)(q)(iv))",
                    "status": status,
                    "quality_score": 1.0,
                    "quality_flags": ["statutory_provision", act_abbr.lower()]
                }
                self.legislation_records.append(record)
                act_records += 1

            print(f"  Normalized {formal_title}: {act_records} valid canonical records")

    def normalize_priority_statutes(self):
        """Normalizes specialized priority statutes (CPA, RERA, RTI, TPA, MTA, Constitution, Legal Aid)."""
        print("\n--- Normalizing Priority Specialized Statutes ---")
        path = os.path.join(RAW_DIR, "legislation", "priority_specialized_statutes.json")
        if not os.path.exists(path):
            return

        with open(path, "r", encoding="utf-8") as f:
            statutes = json.load(f)

        for item in statutes:
            act = item.get("act", "Central Act")
            sec = item.get("section", "")
            title = item.get("title", "")
            text = item.get("text", "")
            cat = item.get("category", "general")

            citation_key = f"{act}_{sec}"
            if self.is_duplicate(text, citation_key):
                continue

            clean_sec = re.sub(r"[^\w]", "_", sec)
            clean_act = re.sub(r"[^\w]", "_", act)[:20]
            doc_id = item.get("source_id") or f"pri_{clean_act}_{clean_sec}".lower()

            record = {
                "document_id": doc_id,
                "document_type": "act_section",
                "title": f"{act} - {sec}: {title}",
                "jurisdiction": item.get("jurisdiction", "India (Central)"),
                "state": "Central",
                "court": None,
                "language": "en",
                "date": "2019-08-09" if "Consumer" in act else ("2016-03-26" if "Real Estate" in act else "2005-06-15"),
                "act": act,
                "section": sec,
                "case_number": None,
                "citation": f"{act}, {sec}",
                "text": f"{act} - {sec}: {title}\n\n{text}",
                "summary": f"{title}. Authoritative statutory authority under {act}.",
                "source_url": item.get("official_url", "https://www.indiacode.nic.in"),
                "source_dataset": "Legal Saathi Statutory Corpus",
                "license": "Government / Public Domain (Copyright Act §52(1)(q)(iv))",
                "status": "current",
                "quality_score": 1.0,
                "quality_flags": ["priority_domain_statute", cat]
            }
            self.legislation_records.append(record)

        print(f"  Normalized Priority Statutes: {len(statutes)} canonical records")

    def normalize_supreme_court_judgments(self):
        """Normalizes Supreme Court Judgments (2022-2024) from AWS Open Data parquet."""
        print("\n--- Normalizing Supreme Court Judgments (AWS Open Data) ---")
        judgments_dir = os.path.join(RAW_DIR, "judgments")
        sc_files = [f for f in os.listdir(judgments_dir) if f.startswith("sc_metadata_") and f.endswith(".parquet")]

        total_sc = 0
        for f in sc_files:
            p = os.path.join(judgments_dir, f)
            table = pq.read_table(p)
            rows = table.to_pylist()

            for row in rows:
                title = (row.get("title") or "").strip()
                case_id = (row.get("case_id") or "").strip()
                citation = (row.get("citation") or "").strip()
                decision_date = (row.get("decision_date") or "").strip()
                court = (row.get("court") or "Supreme Court of India").strip()
                judge = (row.get("judge") or "").strip()
                disposal = (row.get("disposal_nature") or "").strip()
                petitioner = (row.get("petitioner") or "").strip()
                respondent = (row.get("respondent") or "").strip()

                if not title or len(title) < 5:
                    continue

                # Content text for retrieval
                content_text = (
                    f"Supreme Court of India Judgment\n"
                    f"Title: {title}\n"
                    f"Citation: {citation} | Neutral Citation: {case_id}\n"
                    f"Decision Date: {decision_date} | Bench: {judge}\n"
                    f"Petitioner: {petitioner}\n"
                    f"Respondent: {respondent}\n"
                    f"Disposal Nature: {disposal}\n"
                    f"Authority: Supreme Court of India precedent with binding effect under Article 141 of the Constitution."
                )

                citation_key = f"SC_{case_id}_{citation}"
                if self.is_duplicate(content_text, citation_key):
                    continue

                doc_id = f"sc_{row.get('year', '2024')}_{re.sub(r'[^a-zA-Z0-9]', '_', case_id or citation)[:30]}".lower()

                record = {
                    "document_id": doc_id,
                    "document_type": "judgment",
                    "title": title,
                    "jurisdiction": "India",
                    "state": "National",
                    "court": court,
                    "language": "en",
                    "date": decision_date,
                    "act": None,
                    "section": None,
                    "case_number": case_id,
                    "citation": citation or case_id,
                    "text": content_text,
                    "summary": f"Judgment of the Supreme Court of India in {title} decided on {decision_date}. Citation: {citation}. Bench: {judge}.",
                    "source_url": f"https://indian-supreme-court-judgments.s3.amazonaws.com/{row.get('path', '')}",
                    "source_dataset": "AWS Open Data Indian Supreme Court Judgments",
                    "license": "CC-BY-4.0 (Packaging); Underlying text public domain",
                    "status": "current",
                    "quality_score": 1.0,
                    "quality_flags": ["supreme_court_precedent", "binding_art_141"]
                }
                self.judgment_records.append(record)
                total_sc += 1

        print(f"  Normalized Supreme Court Judgments: {total_sc} canonical records")

    def normalize_high_court_sample(self, max_cases: int = 2500):
        """Normalizes a high-quality stratified sample of High Court cases from AWS Open Data."""
        print("\n--- Normalizing High Court Judgments Sample ---")
        p = os.path.join(RAW_DIR, "judgments", "hc_case_details_sample.parquet")
        if not os.path.exists(p):
            return

        table = pq.read_table(p)
        rows = table.to_pylist()
        print(f"  Scanning High Court pool ({len(rows)} cases available)...")

        added = 0
        for row in rows:
            cnr = (row.get("cnr") or "").strip()
            case_no = (row.get("case_no") or "").strip()
            court = (row.get("court") or "High Court").strip()
            bench = (row.get("bench") or "").strip()
            judge = (row.get("judge") or "").strip()
            section_type = (row.get("judicial_section") or "").strip()
            petitioner = (row.get("petitioner") or "").strip()
            respondent = (row.get("respondent") or "").strip()
            decision_date = (row.get("date_of_decision") or row.get("date_of_registration") or "").strip()
            disposal = (row.get("disposal_nature") or "").strip()

            if not petitioner or not respondent:
                continue

            title = f"{petitioner} versus {respondent}"
            content_text = (
                f"High Court Order / Case Record\n"
                f"Court: {court} ({bench})\n"
                f"Case No: {case_no} | CNR: {cnr}\n"
                f"Jurisdiction: {section_type}\n"
                f"Parties: {title}\n"
                f"Presiding Judge: {judge}\n"
                f"Date of Decision: {decision_date} | Disposal: {disposal}\n"
                f"Judicial precedent and case record from {court}."
            )

            citation_key = f"HC_{cnr}"
            if self.is_duplicate(content_text, citation_key):
                continue

            doc_id = f"hc_{cnr.lower()[:30]}"
            record = {
                "document_id": doc_id,
                "document_type": "judgment",
                "title": f"{court} - {case_no}: {title}",
                "jurisdiction": "India",
                "state": "Maharashtra" if "Bombay" in court else "Delhi",
                "court": court,
                "language": "en",
                "date": decision_date,
                "act": None,
                "section": None,
                "case_number": case_no or cnr,
                "citation": f"{court}, Case {case_no} (CNR: {cnr})",
                "text": content_text,
                "summary": f"{court} judgment between {title}. Disposal: {disposal}.",
                "source_url": "https://indian-high-court-judgments.s3.amazonaws.com",
                "source_dataset": "AWS Open Data Indian High Court Judgments",
                "license": "CC-BY-4.0 (Packaging); Underlying text public domain",
                "status": "current",
                "quality_score": 0.95,
                "quality_flags": ["high_court_record", section_type.lower()]
            }
            self.judgment_records.append(record)
            added += 1

            if added >= max_cases:
                break

        print(f"  Normalized High Court Sample: {added} canonical records")

    def normalize_legal_aid_directory(self):
        """Normalizes Legal Aid guidelines, NALSA rules, and Consumer Forum hierarchy."""
        print("\n--- Normalizing Legal Aid & Consumer Forum Rules ---")
        p = os.path.join(RAW_DIR, "legal_aid", "nalsa_and_consumer_forum_directory.json")
        if not os.path.exists(p):
            return

        with open(p, "r", encoding="utf-8") as f:
            data = json.load(f)

        # 1. NALSA Free Legal Aid Rule
        nalsa = data.get("nalsa_overview", {})
        nalsa_text = (
            f"National Legal Services Authority (NALSA) Guidelines\n"
            f"Statutory Authority: {nalsa.get('statutory_act')}\n"
            f"Toll-Free Legal Aid Helpline: {nalsa.get('toll_free_helpline')} (24x7)\n"
            f"Automatic Eligibility without Income Proof: {', '.join(nalsa.get('automatic_eligibility_without_income_proof', []))}\n"
            f"Income ceiling for general indigent citizens: Rs. 3,00,000 per annum across most states.\n"
            f"Services provided: Free counsel representation, court fees waiver, drafting expenses, certified copy costs."
        )
        self.legal_aid_records.append({
            "document_id": "aid_nalsa_eligibility_guidelines",
            "document_type": "legal_aid_rule",
            "title": "NALSA Free Legal Aid Eligibility & National Helpline 15100",
            "jurisdiction": "India",
            "state": "National",
            "court": None,
            "language": "en",
            "date": "1987-10-11",
            "act": "Legal Services Authorities Act, 1987",
            "section": "Section 12",
            "case_number": None,
            "citation": "Legal Services Authorities Act, 1987, Section 12",
            "text": nalsa_text,
            "summary": "Eligibility criteria and procedural guidelines for availing free legal aid in India under NALSA and DLSA.",
            "source_url": "https://nalsa.gov.in",
            "source_dataset": "NALSA Guidelines & OGD India",
            "license": "Government / Public Information",
            "status": "current",
            "quality_score": 1.0,
            "quality_flags": ["legal_aid", "nalsa", "helpline_15100"]
        })

        # 2. Consumer Forum Hierarchy
        cf = data.get("consumer_redressal_hierarchy", {})
        cf_text = (
            f"Consumer Disputes Redressal Commission Three-Tier Hierarchy (CPA 2019 Rules):\n"
            f"1. District Commission (DCDRC): Pecuniary limits for claims where consideration paid does not exceed Rs. 50 Lakhs. Online filing via e-Daakhil.\n"
            f"2. State Commission (SCDRC): Claims between Rs. 50 Lakhs and Rs. 2 Crores, and appeals from District Commissions within 45 days.\n"
            f"3. National Commission (NCDRC): Claims exceeding Rs. 2 Crores, located in New Delhi, and appeals from State Commissions within 30 days.\n"
            f"Limitation period: 2 years from date of cause of action under Section 69 CPA 2019."
        )
        self.legal_aid_records.append({
            "document_id": "aid_consumer_commission_jurisdiction_rules",
            "document_type": "legal_aid_rule",
            "title": "Consumer Commission Hierarchy, Pecuniary Limits & e-Daakhil Filing",
            "jurisdiction": "India",
            "state": "National",
            "court": None,
            "language": "en",
            "date": "2019-08-09",
            "act": "Consumer Protection Act, 2019",
            "section": "Sections 34, 47, 58, 69",
            "case_number": None,
            "citation": "Consumer Protection Act 2019 & 2021 Rules",
            "text": cf_text,
            "summary": "Jurisdiction tiers, filing limits, and appeal timeframes for consumer dispute commissions in India.",
            "source_url": "https://edaakhil.nic.in",
            "source_dataset": "Department of Consumer Affairs / e-Daakhil",
            "license": "Government / Public Information",
            "status": "current",
            "quality_score": 1.0,
            "quality_flags": ["consumer_redressal", "edaakhil"]
        })

        print(f"  Normalized Legal Aid: {len(self.legal_aid_records)} canonical records")

    def normalize_incident_clusters(self):
        """Normalizes synthetic incident clusters for community legal action."""
        print("\n--- Normalizing Synthetic Incident Clusters ---")
        p = os.path.join(RAW_DIR, "incidents", "synthetic_incident_clusters.json")
        if not os.path.exists(p):
            return

        with open(p, "r", encoding="utf-8") as f:
            clusters = json.load(f)

        for cl in clusters:
            cid = cl.get("cluster_id")
            issue = cl.get("issue_type")
            locality = cl.get("locality_bucket")
            text = (
                f"Legal Saathi Incident Cluster: {issue.upper()} in {locality}\n"
                f"Cluster ID: {cid}\n"
                f"Affected Parties Count: {cl.get('member_count')}\n"
                f"Amount Range: {cl.get('amount_bucket')}\n"
                f"Incident Summary: {cl.get('explanation_text')}\n"
                f"Collective Action Pathways: {'; '.join(cl.get('collective_remedy_pathway', []))}\n"
                f"Opposing Party Identifier Hash: {cl.get('opposing_party_hash')}"
            )

            record = {
                "document_id": cid,
                "document_type": "incident_cluster",
                "title": f"Collective Incident Pattern: {issue.title()} - {locality}",
                "jurisdiction": "India",
                "state": locality.split("_")[0] if "_" in locality else "India",
                "court": None,
                "language": "en",
                "date": "2026-09-01",
                "act": None,
                "section": None,
                "case_number": None,
                "citation": f"Legal Saathi Engine Cluster {cid}",
                "text": text,
                "summary": cl.get("explanation_text"),
                "source_url": "legal-saathi://engine/clusters",
                "source_dataset": "Legal Saathi Collective Action Engine",
                "license": "Proprietary Synthetic (Privacy Preserving)",
                "status": "current",
                "quality_score": 1.0,
                "quality_flags": ["synthetic_incident_cluster", issue]
            }
            self.incident_records.append(record)

        print(f"  Normalized Incident Clusters: {len(self.incident_records)} canonical records")

    def export(self):
        """Exports normalized records into canonical JSON datasets."""
        os.makedirs(NORMALIZED_DIR, exist_ok=True)

        with open(os.path.join(NORMALIZED_DIR, "legislation_canonical.json"), "w", encoding="utf-8") as f:
            json.dump(self.legislation_records, f, indent=2)

        with open(os.path.join(NORMALIZED_DIR, "judgments_canonical.json"), "w", encoding="utf-8") as f:
            json.dump(self.judgment_records, f, indent=2)

        with open(os.path.join(NORMALIZED_DIR, "legal_aid_canonical.json"), "w", encoding="utf-8") as f:
            json.dump(self.legal_aid_records, f, indent=2)

        with open(os.path.join(NORMALIZED_DIR, "incident_clusters_canonical.json"), "w", encoding="utf-8") as f:
            json.dump(self.incident_records, f, indent=2)

        master = (
            self.legislation_records +
            self.judgment_records +
            self.legal_aid_records +
            self.incident_records
        )
        with open(os.path.join(NORMALIZED_DIR, "master_canonical_corpus.json"), "w", encoding="utf-8") as f:
            json.dump(master, f, indent=2)

        print("\n=== NORMALIZATION & DEDUPLICATION REPORT ===")
        print(f"Legislation Canonical Records:  {len(self.legislation_records):,}")
        print(f"Judgments Canonical Records:    {len(self.judgment_records):,}")
        print(f"Legal Aid Canonical Records:    {len(self.legal_aid_records):,}")
        print(f"Incident Clusters:              {len(self.incident_records):,}")
        print(f"Master Corpus Total Records:    {len(master):,}")
        print(f"Deduplicated Duplicates Filtered: {self.duplicate_count:,}")
        print(f"Canonical outputs stored in {NORMALIZED_DIR} !")


def main():
    normalizer = CorpusNormalizer()
    normalizer.normalize_civictech_bare_acts()
    normalizer.normalize_priority_statutes()
    normalizer.normalize_supreme_court_judgments()
    normalizer.normalize_high_court_sample(max_cases=2500)
    normalizer.normalize_legal_aid_directory()
    normalizer.normalize_incident_clusters()
    normalizer.export()


if __name__ == "__main__":
    main()
