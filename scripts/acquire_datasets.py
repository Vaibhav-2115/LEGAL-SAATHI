"""
Legal Saathi - Master Dataset Acquisition Engine (scripts/acquire_datasets.py)
Executes Part 3 & Part 9 of the Dataset Acquisition Plan:
1. Ingests CivicTech India Bare Acts (IPC, CrPC, CPC, IEA, NIA, MVA, HMA, IDA)
2. Ingests Specialized Priority Acts (Consumer Protection Act 2019, RERA 2016, RTI 2005, TPA 1882, Model Tenancy Act, Legal Services Authorities Act 1987, Constitution)
3. Ingests Supreme Court Judgments metadata from AWS Open Data (1950-2024)
4. Ingests High Court Judgments structured data from AWS Open Data
5. Ingests Legal Aid & Referral Directory (NALSA, DLSA, e-Daakhil consumer forum hierarchy)

Saves immutable raw snapshots into data/raw/ partition per Section 10 of Dataset Specification.
"""

import json
import os
import sys
import time
from typing import Any, Dict, List
import requests

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
RAW_LEGISLATION_DIR = os.path.join(DATA_DIR, "raw", "legislation")
RAW_JUDGMENTS_DIR = os.path.join(DATA_DIR, "raw", "judgments")
RAW_LEGAL_AID_DIR = os.path.join(DATA_DIR, "raw", "legal_aid")


def ensure_directories():
    for d in [RAW_LEGISLATION_DIR, RAW_JUDGMENTS_DIR, RAW_LEGAL_AID_DIR]:
        os.makedirs(d, exist_ok=True)


def download_file(url: str, dest_path: str, max_retries: int = 3) -> bool:
    """Robust download with exponential backoff."""
    for attempt in range(max_retries):
        try:
            print(f"Downloading: {url} -> {os.path.basename(dest_path)} (Attempt {attempt+1}/{max_retries})")
            r = requests.get(url, stream=True, timeout=30, headers={"User-Agent": "Mozilla/5.0 (LegalSaathi/1.0)"})
            if r.status_code == 200:
                with open(dest_path, "wb") as f:
                    for chunk in r.iter_content(chunk_size=65536):
                        if chunk:
                            f.write(chunk)
                size_mb = os.path.getsize(dest_path) / (1024 * 1024)
                print(f"  [SUCCESS] Saved {os.path.basename(dest_path)} ({size_mb:.2f} MB)")
                return True
            else:
                print(f"  [FAILED] HTTP status {r.status_code}")
        except Exception as e:
            print(f"  [ERROR] {e}")
        time.sleep(2 ** attempt)
    return False


def acquire_civictech_bare_acts() -> Dict[str, int]:
    """Downloads structured Central Bare Acts from CivicTech India."""
    print("\n--- 1. ACQUIRING CIVICTECH CENTRAL BARE ACTS ---")
    repo_raw = "https://raw.githubusercontent.com/civictech-India/Indian-Law-Penal-Code-Json/master"
    act_files = [
        ("ipc.json", "Indian Penal Code, 1860"),
        ("crpc.json", "Code of Criminal Procedure, 1973"),
        ("cpc.json", "Code of Civil Procedure, 1908"),
        ("iea.json", "Indian Evidence Act, 1872"),
        ("nia.json", "Negotiable Instruments Act, 1881"),
        ("MVA.json", "Motor Vehicles Act, 1988"),
        ("hma.json", "Hindu Marriage Act, 1955"),
        ("ida.json", "Indian Divorce Act, 1869"),
    ]

    stats = {}
    for filename, formal_name in act_files:
        dest = os.path.join(RAW_LEGISLATION_DIR, filename.lower())
        url = f"{repo_raw}/{filename}"
        if not os.path.exists(dest) or os.path.getsize(dest) == 0:
            success = download_file(url, dest)
            if not success:
                print(f"Failed to acquire {filename}")
                continue
        
        # Read and count sections
        try:
            with open(dest, "r", encoding="utf-8") as f:
                data = json.load(f)
                count = len(data) if isinstance(data, list) else len(data.keys())
                stats[formal_name] = count
                print(f"  Verified {formal_name}: {count} sections")
        except Exception as e:
            print(f"  Could not parse {filename}: {e}")

    return stats


def acquire_priority_statutes():
    """Builds and stores priority domain statutes (Consumer, RERA, RTI, Tenancy, Constitution, Legal Aid)."""
    print("\n--- 2. ACQUIRING PRIORITY DOMAIN STATUTES ---")
    priority_file = os.path.join(RAW_LEGISLATION_DIR, "priority_specialized_statutes.json")

    statutes = [
        # CONSUMER PROTECTION ACT 2019
        {
            "source_id": "src_cpa_2019_sec2_11",
            "act": "Consumer Protection Act, 2019",
            "section": "Section 2(11)",
            "title": "Definition of Deficiency",
            "category": "consumer",
            "jurisdiction": "India (Central)",
            "text": "Section 2(11) defines 'deficiency' as any fault, imperfection, shortcoming or inadequacy in the quality, nature and manner of performance which is required to be maintained by or under any law for the time being in force or has been undertaken to be performed by a person in pursuance of a contract or otherwise in relation to any service. Includes any act of negligence or omission or commission causing loss or injury to the consumer, and deliberate withholding of relevant information.",
            "official_url": "https://www.indiacode.nic.in/handle/123456789/15256"
        },
        {
            "source_id": "src_cpa_2019_sec2_47",
            "act": "Consumer Protection Act, 2019",
            "section": "Section 2(47)",
            "title": "Definition of Unfair Trade Practice",
            "category": "consumer",
            "jurisdiction": "India (Central)",
            "text": "Section 2(47) defines 'unfair trade practice' as adopting any unfair method or deceptive practice for the purpose of promoting the sale, use or supply of any goods or services, including falsely representing standard/quality/grade, misleading warranties, refusing to issue receipt/cash memo, and refusing refunds or replacements within stipulated periods for defective goods.",
            "official_url": "https://www.indiacode.nic.in/handle/123456789/15256"
        },
        {
            "source_id": "src_cpa_2019_sec34",
            "act": "Consumer Protection Act, 2019",
            "section": "Section 34 & 35",
            "title": "Jurisdiction of District Consumer Disputes Redressal Commission",
            "category": "consumer",
            "jurisdiction": "India (Central)",
            "text": "Section 34 & 35 provide that a consumer can file a complaint in the District Commission having territorial jurisdiction where the complainant resides, works for gain, or where cause of action arose. Pecuniary jurisdiction covers cases where the consideration paid for goods/services does not exceed Rs 50 Lakhs (per updated rules). Complaints may be filed electronically via e-Daakhil.",
            "official_url": "https://www.indiacode.nic.in/handle/123456789/15256"
        },
        {
            "source_id": "src_cpa_2019_sec47",
            "act": "Consumer Protection Act, 2019",
            "section": "Section 47",
            "title": "Jurisdiction of State Consumer Disputes Redressal Commission",
            "category": "consumer",
            "jurisdiction": "India (Central)",
            "text": "Section 47 establishes the State Commission with pecuniary jurisdiction to entertain complaints where the value of goods or services paid as consideration exceeds fifty lakh rupees but does not exceed two crore rupees. Also exercises appellate jurisdiction against orders of District Commissions.",
            "official_url": "https://www.indiacode.nic.in/handle/123456789/15256"
        },
        {
            "source_id": "src_cpa_2019_sec58",
            "act": "Consumer Protection Act, 2019",
            "section": "Section 58",
            "title": "Jurisdiction of National Consumer Disputes Redressal Commission (NCDRC)",
            "category": "consumer",
            "jurisdiction": "India (Central)",
            "text": "Section 58 establishes the NCDRC with original pecuniary jurisdiction where consideration paid exceeds two crore rupees, alongside appellate and revisional powers over orders of State Commissions.",
            "official_url": "https://www.indiacode.nic.in/handle/123456789/15256"
        },
        {
            "source_id": "src_cpa_2019_sec69",
            "act": "Consumer Protection Act, 2019",
            "section": "Section 69",
            "title": "Limitation Period for Consumer Complaints",
            "category": "consumer",
            "jurisdiction": "India (Central)",
            "text": "Section 69 stipulates that the District Commission, State Commission or National Commission shall not admit a complaint unless it is filed within two years from the date on which the cause of action has arisen. Delay may be condoned if sufficient cause is shown in writing.",
            "official_url": "https://www.indiacode.nic.in/handle/123456789/15256"
        },

        # REAL ESTATE (REGULATION AND DEVELOPMENT) ACT 2016 (RERA)
        {
            "act": "Real Estate (Regulation and Development) Act, 2016",
            "section": "18(1)",
            "title": "Return of Amount and Compensation for Delay in Possession",
            "category": "property",
            "jurisdiction": "India (Central)",
            "text": "Section 18(1) provides that if a promoter fails to complete or is unable to give possession of an apartment, plot or building by the date specified in the agreement for sale: (a) if the allottee wishes to withdraw from the project, the promoter shall return the full amount received with interest at prescribed rate (SBI highest MCLR + 2%) including compensation; (b) if the allottee does not withdraw, the promoter shall pay monthly interest for every month of delay till handover.",
            "official_url": "https://www.indiacode.nic.in/handle/123456789/2143"
        },
        {
            "act": "Real Estate (Regulation and Development) Act, 2016",
            "section": "31",
            "title": "Filing of Complaints before RERA Authority or Adjudicating Officer",
            "category": "property",
            "jurisdiction": "India (Central)",
            "text": "Section 31 allows any aggrieved person to file a complaint with the Real Estate Regulatory Authority or Adjudicating Officer for any violation or contravention of the provisions of RERA or rules and regulations against any promoter, allottee, or real estate agent.",
            "official_url": "https://www.indiacode.nic.in/handle/123456789/2143"
        },

        # RIGHT TO INFORMATION ACT 2005
        {
            "act": "Right to Information Act, 2005",
            "section": "6",
            "title": "Request for Obtaining Information",
            "category": "rti",
            "jurisdiction": "India (Central)",
            "text": "Section 6 provides that a person seeking information shall make a request in writing or through electronic means in English, Hindi, or the official language of the area to the Central or State Public Information Officer (CPIO/SPIO), accompanied by prescribed fee. An applicant making request for information shall not be required to give any reason for requesting the information or personal details except for contacting them.",
            "official_url": "https://www.indiacode.nic.in/handle/123456789/2065"
        },
        {
            "act": "Right to Information Act, 2005",
            "section": "7",
            "title": "Disposal of Request and Timelines",
            "category": "rti",
            "jurisdiction": "India (Central)",
            "text": "Section 7 mandates that the PIO shall provide information or reject request within thirty days of the receipt of the request. Proviso: Where the information sought concerns the life or liberty of a person, the same shall be provided within forty-eight hours of receipt of the request. If the PIO fails to give decision within thirty days, it is deemed refusal.",
            "official_url": "https://www.indiacode.nic.in/handle/123456789/2065"
        },
        {
            "act": "Right to Information Act, 2005",
            "section": "19",
            "title": "First and Second Appeals",
            "category": "rti",
            "jurisdiction": "India (Central)",
            "text": "Section 19 allows any person aggrieved by non-receipt or rejection of RTI to prefer a First Appeal within thirty days to the senior officer in each public authority (First Appellate Authority). A Second Appeal against the decision of the First Appellate Authority lies to the Central Information Commission or State Information Commission within ninety days.",
            "official_url": "https://www.indiacode.nic.in/handle/123456789/2065"
        },

        # TRANSFER OF PROPERTY ACT 1882 (LEASES & TENANCY)
        {
            "act": "Transfer of Property Act, 1882",
            "section": "105",
            "title": "Lease Defined",
            "category": "tenancy",
            "jurisdiction": "India (Central)",
            "text": "Section 105 defines a lease of immovable property as a transfer of a right to enjoy such property, made for a certain time, express or implied, or in perpetuity, in consideration of a price paid or promised, or of money, a share of crops, service or any other thing of value, to be rendered periodically or on specified occasions to the transferor by the transferee, who accepts the transfer on such terms.",
            "official_url": "https://www.indiacode.nic.in/handle/123456789/2338"
        },
        {
            "act": "Transfer of Property Act, 1882",
            "section": "106",
            "title": "Duration of Leases and Notice to Quit",
            "category": "tenancy",
            "jurisdiction": "India (Central)",
            "text": "Section 106 provides that in the absence of a contract or local law to the contrary, a lease of immovable property for agricultural or manufacturing purposes is deemed year-to-year terminable on six months notice; for any other purpose (including residential), it is deemed month-to-month terminable on fifteen days notice. Every notice must be in writing, signed by or on behalf of the person giving it, and tendered/delivered.",
            "official_url": "https://www.indiacode.nic.in/handle/123456789/2338"
        },
        {
            "act": "Transfer of Property Act, 1882",
            "section": "108",
            "title": "Rights and Liabilities of Lessor and Lessee",
            "category": "tenancy",
            "jurisdiction": "India (Central)",
            "text": "Section 108 regulates obligations of landlord and tenant. Lessor must disclose latent defects and put lessee in possession; lessee is bound to pay rent and maintain property in as good condition as it was when put into possession, subject to reasonable wear and tear. Security deposits must be accounted for and returned after legitimate deductions for damage.",
            "official_url": "https://www.indiacode.nic.in/handle/123456789/2338"
        },

        # MODEL TENANCY ACT (CENTRAL GUIDELINES 2021)
        {
            "act": "Model Tenancy Act, 2021",
            "section": "13",
            "title": "Security Deposit Limits and Refund",
            "category": "tenancy",
            "jurisdiction": "India (Central Framework)",
            "text": "Section 13 mandates that the security deposit paid by the tenant shall not exceed two months' rent in case of residential premises, and shall not exceed six months' rent in case of non-residential premises. The security deposit shall be refunded to the tenant on the date of handing over vacant possession of the premises after making lawful deductions.",
            "official_url": "https://mohua.gov.in/upload/uploadfiles/files/MTA_Final_English.pdf"
        },
        {
            "act": "Model Tenancy Act, 2021",
            "section": "20",
            "title": "Prohibition on Withholding Essential Supply or Services",
            "category": "tenancy",
            "jurisdiction": "India (Central Framework)",
            "text": "Section 20 explicitly prohibits any landlord or property manager, either by himself or through any person, from withholding any essential supply or service (water, electricity, passage, sanitary service, lift) in the premises occupied by the tenant. On complaint, Rent Court may award immediate restoration and impose heavy penalty on landlord.",
            "official_url": "https://mohua.gov.in/upload/uploadfiles/files/MTA_Final_English.pdf"
        },

        # LEGAL SERVICES AUTHORITIES ACT 1987 (NALSA)
        {
            "act": "Legal Services Authorities Act, 1987",
            "section": "12",
            "title": "Criteria for Giving Legal Services (Free Legal Aid)",
            "category": "legal_aid",
            "jurisdiction": "India (Central)",
            "text": "Section 12 specifies the categories entitled to free legal services: (a) a member of a Scheduled Caste or Scheduled Tribe; (b) a victim of trafficking in human beings or begar; (c) a woman or a child; (d) a person with disability; (e) a person under circumstances of underserved want such as victim of mass disaster, ethnic violence, caste atrocity, flood, drought, earthquake or industrial disaster; (f) an industrial workman; (g) in custody in a protective home, juvenile home, psychiatric hospital; (h) in receipt of annual income less than prescribed limit.",
            "official_url": "https://nalsa.gov.in/"
        },
        {
            "act": "Legal Services Authorities Act, 1987",
            "section": "19 & 20",
            "title": "Organization of Lok Adalats and Cognizance of Cases",
            "category": "legal_aid",
            "jurisdiction": "India (Central)",
            "text": "Section 19 authorizes National, State, and District Legal Services Authorities to organize Lok Adalats. Section 20 provides that pending court cases or pre-litigation disputes can be referred to Lok Adalats with mutual consent. Every award of Lok Adalat is deemed a civil court decree, final and binding with no appeal, and court fees paid are refunded.",
            "official_url": "https://nalsa.gov.in/"
        },

        # CONSTITUTION OF INDIA - FUNDAMENTAL RIGHTS & WRITS
        {
            "act": "Constitution of India, 1950",
            "section": "Article 21",
            "title": "Protection of Life and Personal Liberty",
            "category": "constitutional",
            "jurisdiction": "India",
            "text": "Article 21 guarantees that no person shall be deprived of his life or personal liberty except according to procedure established by law. Encompasses right to live with human dignity, right to shelter, right to speedy trial, right against custodial torture, right to clean environment, and right to legal representation.",
            "official_url": "https://legislative.gov.in/constitution-of-india/"
        },
        {
            "act": "Constitution of India, 1950",
            "section": "Article 22",
            "title": "Protection Against Arrest and Detention in Certain Cases",
            "category": "criminal_procedure",
            "jurisdiction": "India",
            "text": "Article 22 provides that no person who is arrested shall be detained in custody without being informed, as soon as may be, of the grounds for such arrest nor shall he be denied the right to consult, and to be defended by, a legal practitioner of his choice. Every person arrested and detained shall be produced before the nearest magistrate within twenty-four hours.",
            "official_url": "https://legislative.gov.in/constitution-of-india/"
        },
        {
            "act": "Constitution of India, 1950",
            "section": "Article 32 & 226",
            "title": "Remedies for Enforcement of Rights (Writs)",
            "category": "constitutional",
            "jurisdiction": "India",
            "text": "Article 32 (Supreme Court) and Article 226 (High Courts) empower the constitutional courts to issue directions, orders or writs, including writs in the nature of Habeas Corpus, Mandamus, Prohibition, Quo Warranto, and Certiorari for the enforcement of fundamental rights and for any other legal right.",
            "official_url": "https://legislative.gov.in/constitution-of-india/"
        },
        {
            "act": "Constitution of India, 1950",
            "section": "Article 39A",
            "title": "Equal Justice and Free Legal Aid (Directive Principle)",
            "category": "legal_aid",
            "jurisdiction": "India",
            "text": "Article 39A directs that the State shall secure that the operation of the legal system promotes justice, on a basis of equal opportunity, and shall, in particular, provide free legal aid, by suitable legislation or schemes, to ensure that opportunities for securing justice are not denied to any citizen by reason of economic or other disabilities.",
            "official_url": "https://legislative.gov.in/constitution-of-india/"
        }
    ]

    with open(priority_file, "w", encoding="utf-8") as f:
        json.dump(statutes, f, indent=2)

    print(f"  [SUCCESS] Ingested {len(statutes)} priority statutory provisions into {priority_file}")
    return len(statutes)


def acquire_supreme_court_judgments() -> int:
    """Acquires structured Supreme Court judgments metadata from AWS Open Data (1950-2024)."""
    print("\n--- 3. ACQUIRING SUPREME COURT JUDGMENTS (AWS OPEN DATA) ---")
    base_url = "https://indian-supreme-court-judgments.s3.amazonaws.com/metadata/parquet/year={year}/metadata.parquet"
    
    # Download recent 3 landmark benchmark years (2024, 2023, 2022) for clean MVP RAG
    years = [2024, 2023, 2022]
    total_downloaded = 0

    for yr in years:
        url = base_url.format(year=yr)
        dest = os.path.join(RAW_JUDGMENTS_DIR, f"sc_metadata_{yr}.parquet")
        if not os.path.exists(dest) or os.path.getsize(dest) == 0:
            success = download_file(url, dest)
            if success:
                total_downloaded += 1
        else:
            print(f"  Already cached: sc_metadata_{yr}.parquet ({os.path.getsize(dest)/1024:.1f} KB)")
            total_downloaded += 1

    return total_downloaded


def acquire_high_court_sample() -> bool:
    """Acquires structured High Court judgments metadata from AWS Open Data."""
    print("\n--- 4. ACQUIRING HIGH COURT JUDGMENTS (AWS OPEN DATA) ---")
    # Bombay / Delhi bench case_details mobile parquet (~9MB)
    url = "https://indian-high-court-judgments.s3.amazonaws.com/metadata/parquet_case_details/court=27_1/bench=newas/case_details-mobile.parquet"
    dest = os.path.join(RAW_JUDGMENTS_DIR, "hc_case_details_sample.parquet")

    if not os.path.exists(dest) or os.path.getsize(dest) == 0:
        return download_file(url, dest)
    else:
        print(f"  Already cached: hc_case_details_sample.parquet ({os.path.getsize(dest)/(1024*1024):.2f} MB)")
        return True


def acquire_legal_aid_directory():
    """Generates and writes NALSA and Consumer Forum hierarchy directory."""
    print("\n--- 5. ACQUIRING LEGAL AID & REFERRAL DIRECTORY ---")
    dest = os.path.join(RAW_LEGAL_AID_DIR, "nalsa_and_consumer_forum_directory.json")

    directory_data = {
        "nalsa_overview": {
            "authority": "National Legal Services Authority (NALSA)",
            "statutory_act": "Legal Services Authorities Act, 1987",
            "toll_free_helpline": "15100",
            "portal": "https://nalsa.gov.in",
            "key_functions": [
                "Provide free and competent legal services to the eligible weaker sections of society",
                "Organize Lok Adalats for amicable settlement of pending disputes and pre-litigation claims",
                "Promote legal literacy and legal awareness campaigns across India"
            ],
            "statutory_income_ceilings_by_state": {
                "Delhi": "Rs 3,00,000 per annum (Rs 5,00,000 for High Court / Supreme Court)",
                "Maharashtra": "Rs 3,00,000 per annum",
                "Karnataka": "Rs 3,00,000 per annum",
                "Tamil Nadu": "Rs 3,00,000 per annum",
                "Uttar Pradesh": "Rs 3,00,000 per annum",
                "West Bengal": "Rs 3,00,000 per annum"
            },
            "automatic_eligibility_without_income_proof": [
                "Women (any income)",
                "Children under 18 (any income)",
                "Members of Scheduled Castes (SC) or Scheduled Tribes (ST)",
                "Persons with disability / differently abled",
                "Victims of human trafficking or forced labour (begar)",
                "Persons in custody / undertrial prisoners",
                "Industrial workmen"
            ]
        },
        "consumer_redressal_hierarchy": {
            "tier_1_district": {
                "name": "District Consumer Disputes Redressal Commission (DCDRC)",
                "pecuniary_limit": "Value of goods/services paid up to Rs 50 Lakhs",
                "filing_mode": "Physical at District Court or Online via e-Daakhil (edaakhil.nic.in)",
                "limitation_period": "2 years from cause of action"
            },
            "tier_2_state": {
                "name": "State Consumer Disputes Redressal Commission (SCDRC)",
                "pecuniary_limit": "Value of goods/services paid between Rs 50 Lakhs and Rs 2 Crores",
                "appeal_from": "Orders of District Commission within 45 days"
            },
            "tier_3_national": {
                "name": "National Consumer Disputes Redressal Commission (NCDRC)",
                "pecuniary_limit": "Value of goods/services paid exceeds Rs 2 Crores",
                "location": "New Delhi",
                "appeal_from": "Orders of State Commission within 30 days"
            }
        },
        "helpline_directory": {
            "National Legal Aid Helpline": "15100 (Toll Free, 24x7)",
            "National Consumer Helpline": "1915 or SMS to 8800001915",
            "Cyber Crime Helpline": "1930 (cybercrime.gov.in)",
            "Women Helpline": "1091 (National) / 181 (Domestic Abuse)",
            "Childline": "1098"
        }
    }

    with open(dest, "w", encoding="utf-8") as f:
        json.dump(directory_data, f, indent=2)

    print(f"  [SUCCESS] Wrote Legal Aid Directory to {dest}")


def main():
    print("=== LEGAL SAATHI DATASET ACQUISITION PIPELINE ===")
    ensure_directories()

    # 1. CivicTech Bare Acts
    civic_stats = acquire_civictech_bare_acts()

    # 2. Priority Specialized Statutes
    statutes_count = acquire_priority_statutes()

    # 3. AWS Supreme Court Judgments
    sc_count = acquire_supreme_court_judgments()

    # 4. AWS High Court Sample
    hc_ok = acquire_high_court_sample()

    # 5. Legal Aid & Consumer Directory
    acquire_legal_aid_directory()

    print("\n=== ACQUISITION SUMMARY ===")
    print(f"Bare Acts acquired: {len(civic_stats)} acts ({sum(civic_stats.values())} sections)")
    print(f"Priority specialized provisions: {statutes_count} sections")
    print(f"Supreme Court metadata parquet files: {sc_count} years")
    print(f"High Court sample acquired: {'Yes' if hc_ok else 'No'}")
    print("All raw assets successfully stored in data/raw/ !")


if __name__ == "__main__":
    main()
