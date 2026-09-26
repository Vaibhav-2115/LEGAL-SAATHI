"""
Legal Saathi - Statutory Concordance Mapping Builder (scripts/build_mappings.py)
Constructs comprehensive bidirectional concordance tables linking:
1. Indian Penal Code (IPC, 1860) <-> Bharatiya Nyaya Sanhita (BNS, 2023)
2. Code of Criminal Procedure (CrPC, 1973) <-> Bharatiya Nagarik Suraksha Sanhita (BNSS, 2023)
3. Indian Evidence Act (IEA, 1872) <-> Bharatiya Sakshya Adhiniyam (BSA, 2023)

Outputs JSON mapping artifacts to data/mappings/ per Recommendation D of the Acquisition Plan.
"""

import json
import os
from typing import Any, Dict, List

MAPPINGS_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "mappings")


IPC_TO_BNS: List[Dict[str, Any]] = [
    {
        "old_code": "IPC",
        "old_section": "302",
        "old_title": "Punishment for murder",
        "new_code": "BNS",
        "new_section": "103(1)",
        "new_title": "Punishment for murder",
        "category": "Offences Against Human Body",
        "change_notes": "Punishment remains death or imprisonment for life and fine. Sub-section (2) introduces mob lynching by 5 or more persons based on race, caste, sex, place of birth, language, religion.",
        "bailable": False,
        "compoundable": False,
        "cognizable": True
    },
    {
        "old_code": "IPC",
        "old_section": "304",
        "old_title": "Punishment for culpable homicide not amounting to murder",
        "new_code": "BNS",
        "new_section": "105",
        "new_title": "Culpable homicide not amounting to murder",
        "category": "Offences Against Human Body",
        "change_notes": "Divided into intention (imprisonment for life or up to 10 years) and knowledge (up to 10 years).",
        "bailable": False,
        "compoundable": False,
        "cognizable": True
    },
    {
        "old_code": "IPC",
        "old_section": "304A",
        "old_title": "Causing death by negligence",
        "new_code": "BNS",
        "new_section": "106(1)",
        "new_title": "Causing death by negligence (Rash or negligent act)",
        "category": "Offences Against Human Body",
        "change_notes": "Imprisonment increased up to 5 years (previously 2 years) and fine. Section 106(2) provides up to 10 years for hit-and-run without reporting.",
        "bailable": True,
        "compoundable": False,
        "cognizable": True
    },
    {
        "old_code": "IPC",
        "old_section": "304B",
        "old_title": "Dowry death",
        "new_code": "BNS",
        "new_section": "80",
        "new_title": "Dowry death",
        "category": "Offences Against Women",
        "change_notes": "Death within 7 years of marriage under abnormal circumstances with cruelty/harassment for dowry. Minimum 7 years up to life imprisonment.",
        "bailable": False,
        "compoundable": False,
        "cognizable": True
    },
    {
        "old_code": "IPC",
        "old_section": "307",
        "old_title": "Attempt to murder",
        "new_code": "BNS",
        "new_section": "109",
        "new_title": "Attempt to murder",
        "category": "Offences Against Human Body",
        "change_notes": "Substantively identical. Imprisonment up to 10 years, and if hurt caused, life imprisonment or up to 10 years.",
        "bailable": False,
        "compoundable": False,
        "cognizable": True
    },
    {
        "old_code": "IPC",
        "old_section": "309",
        "old_title": "Attempt to commit suicide",
        "new_code": "BNS",
        "new_section": "226",
        "new_title": "Attempt to commit suicide to compel or restrain exercise of lawful power",
        "category": "Contempts of Lawful Authority",
        "change_notes": "General attempt to suicide is decriminalized; penalized only when done with intent to compel/restrain a public servant from discharging duty.",
        "bailable": True,
        "compoundable": False,
        "cognizable": True
    },
    {
        "old_code": "IPC",
        "old_section": "323",
        "old_title": "Punishment for voluntarily causing hurt",
        "new_code": "BNS",
        "new_section": "115(2)",
        "new_title": "Voluntarily causing hurt",
        "category": "Offences Against Human Body",
        "change_notes": "Imprisonment up to 1 year, or fine up to Rs. 1,000, or both.",
        "bailable": True,
        "compoundable": True,
        "cognizable": False
    },
    {
        "old_code": "IPC",
        "old_section": "325",
        "old_title": "Punishment for voluntarily causing grievous hurt",
        "new_code": "BNS",
        "new_section": "117(2)",
        "new_title": "Voluntarily causing grievous hurt",
        "category": "Offences Against Human Body",
        "change_notes": "Imprisonment up to 7 years and fine.",
        "bailable": True,
        "compoundable": True,
        "cognizable": True
    },
    {
        "old_code": "IPC",
        "old_section": "354",
        "old_title": "Assault or criminal force to woman with intent to outrage her modesty",
        "new_code": "BNS",
        "new_section": "74",
        "new_title": "Assault or criminal force to woman with intent to outrage modesty",
        "category": "Offences Against Women",
        "change_notes": "Minimum imprisonment 1 year up to 5 years, and fine.",
        "bailable": False,
        "compoundable": False,
        "cognizable": True
    },
    {
        "old_code": "IPC",
        "old_section": "354A",
        "old_title": "Sexual harassment and punishment for sexual harassment",
        "new_code": "BNS",
        "new_section": "75",
        "new_title": "Sexual harassment",
        "category": "Offences Against Women",
        "change_notes": "Physical contact and advances (up to 3 years); sexually coloured remarks (up to 1 year).",
        "bailable": True,
        "compoundable": False,
        "cognizable": True
    },
    {
        "old_code": "IPC",
        "old_section": "354D",
        "old_title": "Stalking",
        "new_code": "BNS",
        "new_section": "78",
        "new_title": "Stalking",
        "category": "Offences Against Women",
        "change_notes": "First conviction bailable (up to 3 years); second conviction non-bailable (up to 5 years). Covers electronic monitoring.",
        "bailable": True,
        "compoundable": False,
        "cognizable": True
    },
    {
        "old_code": "IPC",
        "old_section": "375 / 376",
        "old_title": "Rape and punishment for rape",
        "new_code": "BNS",
        "new_section": "63 / 64",
        "new_title": "Rape and punishment for rape",
        "category": "Offences Against Women",
        "change_notes": "Rigorous imprisonment not less than 10 years up to life imprisonment. Section 69 also introduces deceitful promises to marry.",
        "bailable": False,
        "compoundable": False,
        "cognizable": True
    },
    {
        "old_code": "IPC",
        "old_section": "378 / 379",
        "old_title": "Theft and punishment for theft",
        "new_code": "BNS",
        "new_section": "303(1) / 303(2)",
        "new_title": "Theft and punishment for theft",
        "category": "Offences Against Property",
        "change_notes": "Community service introduced as alternative for petty theft under Rs. 5,000 on first conviction upon return of property.",
        "bailable": True,
        "compoundable": True,
        "cognizable": True
    },
    {
        "old_code": "IPC",
        "old_section": "N/A (Derived from 379)",
        "old_title": "Theft by snatching (Previously charged under 379)",
        "new_code": "BNS",
        "new_section": "304",
        "new_title": "Snatching",
        "category": "Offences Against Property",
        "change_notes": "New substantive offence specifically addressing snatching of phone, purse, or chain. Imprisonment up to 3 years and fine.",
        "bailable": False,
        "compoundable": False,
        "cognizable": True
    },
    {
        "old_code": "IPC",
        "old_section": "383 / 384",
        "old_title": "Extortion and punishment for extortion",
        "new_code": "BNS",
        "new_section": "308",
        "new_title": "Extortion and punishment for extortion",
        "category": "Offences Against Property",
        "change_notes": "Imprisonment up to 3 years, or fine, or both.",
        "bailable": True,
        "compoundable": False,
        "cognizable": True
    },
    {
        "old_code": "IPC",
        "old_section": "390 / 392",
        "old_title": "Robbery and punishment for robbery",
        "new_code": "BNS",
        "new_section": "309",
        "new_title": "Robbery and punishment for robbery",
        "category": "Offences Against Property",
        "change_notes": "Rigorous imprisonment up to 10 years; if committed on highway between sunset and sunrise, up to 14 years.",
        "bailable": False,
        "compoundable": False,
        "cognizable": True
    },
    {
        "old_code": "IPC",
        "old_section": "391 / 395",
        "old_title": "Dacoity and punishment for dacoity",
        "new_code": "BNS",
        "new_section": "310",
        "new_title": "Dacoity and punishment for dacoity",
        "category": "Offences Against Property",
        "change_notes": "Conjoint commission by 5 or more persons. Imprisonment for life or rigorous imprisonment up to 10 years.",
        "bailable": False,
        "compoundable": False,
        "cognizable": True
    },
    {
        "old_code": "IPC",
        "old_section": "405 / 406",
        "old_title": "Criminal breach of trust",
        "new_code": "BNS",
        "new_section": "316",
        "new_title": "Criminal breach of trust",
        "category": "Offences Against Property",
        "change_notes": "Dishonest misappropriation of entrusted property. Imprisonment up to 5 years (previously 3 years) and fine.",
        "bailable": True,
        "compoundable": True,
        "cognizable": True
    },
    {
        "old_code": "IPC",
        "old_section": "415 / 420",
        "old_title": "Cheating and dishonestly inducing delivery of property",
        "new_code": "BNS",
        "new_section": "318",
        "new_title": "Cheating and dishonestly inducing delivery of property",
        "category": "Offences Against Property",
        "change_notes": "BNS 318(4) corresponds to IPC 420. Imprisonment up to 7 years and fine.",
        "bailable": False,
        "compoundable": True,
        "cognizable": True
    },
    {
        "old_code": "IPC",
        "old_section": "463 / 465",
        "old_title": "Forgery and punishment for forgery",
        "new_code": "BNS",
        "new_section": "336 / 338",
        "new_title": "Forgery and punishment for forgery",
        "category": "Documents and Property Marks",
        "change_notes": "Making false document or electronic record. Imprisonment up to 2 years, or fine, or both.",
        "bailable": True,
        "compoundable": False,
        "cognizable": False
    },
    {
        "old_code": "IPC",
        "old_section": "498A",
        "old_title": "Husband or relative of husband subjecting woman to cruelty",
        "new_code": "BNS",
        "new_section": "85 / 86",
        "new_title": "Husband or relative subjecting woman to cruelty",
        "category": "Offences Against Women",
        "change_notes": "BNS Section 85 penalizes cruelty (up to 3 years); Section 86 defines cruelty comprehensively.",
        "bailable": False,
        "compoundable": False,
        "cognizable": True
    },
    {
        "old_code": "IPC",
        "old_section": "499 / 500",
        "old_title": "Defamation and punishment for defamation",
        "new_code": "BNS",
        "new_section": "356",
        "new_title": "Defamation",
        "category": "Defamation",
        "change_notes": "Community service introduced as an alternative punishment alongside simple imprisonment up to 2 years or fine.",
        "bailable": True,
        "compoundable": True,
        "cognizable": False
    },
    {
        "old_code": "IPC",
        "old_section": "503 / 506",
        "old_title": "Criminal intimidation",
        "new_code": "BNS",
        "new_section": "351",
        "new_title": "Criminal intimidation",
        "category": "Intimidation, Insult and Annoyance",
        "change_notes": "Imprisonment up to 2 years or fine; if threat is of death/grievous hurt, up to 7 years.",
        "bailable": True,
        "compoundable": True,
        "cognizable": False
    },
    {
        "old_code": "IPC",
        "old_section": "124A",
        "old_title": "Sedition",
        "new_code": "BNS",
        "new_section": "152",
        "new_title": "Act endangering sovereignty, unity and integrity of India",
        "category": "Offences Against the State",
        "change_notes": "Sedition term omitted; replaced by specific acts exciting secession, armed rebellion, subversive activities, or endangering sovereignty. Life imprisonment or up to 7 years.",
        "bailable": False,
        "compoundable": False,
        "cognizable": True
    },
    {
        "old_code": "IPC",
        "old_section": "141 / 146 / 147",
        "old_title": "Unlawful assembly and rioting",
        "new_code": "BNS",
        "new_section": "189 / 191",
        "new_title": "Unlawful assembly and rioting",
        "category": "Public Tranquillity",
        "change_notes": "Assembly of 5 or more persons with common object. Imprisonment up to 2 years or fine.",
        "bailable": True,
        "compoundable": False,
        "cognizable": True
    },
    {
        "old_code": "IPC",
        "old_section": "279",
        "old_title": "Rash driving or riding on a public way",
        "new_code": "BNS",
        "new_section": "281",
        "new_title": "Rash driving or riding on a public way",
        "category": "Public Health and Safety",
        "change_notes": "Driving endangering human life. Imprisonment up to 6 months, or fine up to Rs. 1,000, or both.",
        "bailable": True,
        "compoundable": False,
        "cognizable": True
    }
]


CRPC_TO_BNSS: List[Dict[str, Any]] = [
    {
        "old_code": "CrPC",
        "old_section": "41 / 41A",
        "old_title": "When police may arrest without warrant / Notice of appearance",
        "new_code": "BNSS",
        "new_section": "35",
        "new_title": "When police may arrest without warrant",
        "category": "Arrest",
        "change_notes": "Prior permission of Deputy SP required for arresting persons above 60 years or for offences punishable with less than 3 years (with caveats). Notice of appearance integrated."
    },
    {
        "old_code": "CrPC",
        "old_section": "50 / 50A",
        "old_title": "Person arrested to be informed of grounds of arrest and right to bail / Obligation to inform relative",
        "new_code": "BNSS",
        "new_section": "47 / 48",
        "new_title": "Person arrested to be informed of grounds of arrest / Designated Police Officer",
        "category": "Arrest",
        "change_notes": "Mandates designated police officer at every district and police station to display names and categories of arrested persons."
    },
    {
        "old_code": "CrPC",
        "old_section": "125",
        "old_title": "Order for maintenance of wives, children and parents",
        "new_code": "BNSS",
        "new_section": "144",
        "new_title": "Order for maintenance of wives, children and parents",
        "category": "Maintenance",
        "change_notes": "Summary statutory remedy for maintenance. Magistrate may order monthly allowance. BNSS retains essence with simplified procedural timelines."
    },
    {
        "old_code": "CrPC",
        "old_section": "144",
        "old_title": "Power to issue order in urgent cases of nuisance or apprehended danger",
        "new_code": "BNSS",
        "new_section": "163",
        "new_title": "Power to issue order in urgent cases of nuisance or apprehended danger",
        "category": "Public Order",
        "change_notes": "District Magistrate / Sub-divisional Magistrate power. Valid up to 2 months, extendable by State Govt up to 6 months."
    },
    {
        "old_code": "CrPC",
        "old_section": "154",
        "old_title": "Information in cognizable cases (First Information Report - FIR)",
        "new_code": "BNSS",
        "new_section": "173",
        "new_title": "Information in cognizable cases (FIR, Zero FIR & E-FIR)",
        "category": "Investigation",
        "change_notes": "Statutory recognition of 'Zero FIR' (must register irrespective of jurisdiction and transfer). Expressly authorizes electronic communication (e-FIR) to be signed within 3 days. Preliminary inquiry permitted for offences punishable with 3-7 years within 14 days."
    },
    {
        "old_code": "CrPC",
        "old_section": "160",
        "old_title": "Police officer's power to require attendance of witnesses",
        "new_code": "BNSS",
        "new_section": "179",
        "new_title": "Police officer's power to require attendance of witnesses",
        "category": "Investigation",
        "change_notes": "Exemption from attending police station extended to persons under 15, over 60 (previously 65), women, and persons with disability/acute illness."
    },
    {
        "old_code": "CrPC",
        "old_section": "161",
        "old_title": "Examination of witnesses by police",
        "new_code": "BNSS",
        "new_section": "180",
        "new_title": "Examination of witnesses by police",
        "category": "Investigation",
        "change_notes": "Permits statement recording through audio-video electronic means including mobile phones."
    },
    {
        "old_code": "CrPC",
        "old_section": "164",
        "old_title": "Recording of confessions and statements by Magistrate",
        "new_code": "BNSS",
        "new_section": "183",
        "new_title": "Recording of confessions and statements",
        "category": "Investigation",
        "change_notes": "Audio-video recording permitted. In sexual offences, statement of victim must be recorded by woman Magistrate or in presence of woman."
    },
    {
        "old_code": "CrPC",
        "old_section": "167",
        "old_title": "Procedure when investigation cannot be completed in twenty-four hours (Remand)",
        "new_code": "BNSS",
        "new_section": "187",
        "new_title": "Procedure when investigation cannot be completed in 24 hours",
        "category": "Investigation",
        "change_notes": "Police custody of up to 15 days can now be sought in whole or in parts during the initial 40 or 60 days of the total detention period."
    },
    {
        "old_code": "CrPC",
        "old_section": "100 / 102",
        "old_title": "Search and seizure of property",
        "new_code": "BNSS",
        "new_section": "105",
        "new_title": "Recording of search and seizure through audio-video electronic means",
        "category": "Search & Seizure",
        "change_notes": "Mandates audio-video electronic recording (videography) of the entire search and seizure process, including preparation of seizure list without delay."
    },
    {
        "old_code": "CrPC",
        "old_section": "436",
        "old_title": "In what cases bail to be taken (Bailable offences)",
        "new_code": "BNSS",
        "new_section": "478",
        "new_title": "In what cases bail to be taken",
        "category": "Bail",
        "change_notes": "Right to bail is absolute in bailable offences upon furnishing surety or personal bond. Indigent persons released on personal recognizance."
    },
    {
        "old_code": "CrPC",
        "old_section": "436A",
        "old_title": "Maximum period for which an undertrial prisoner can be detained",
        "new_code": "BNSS",
        "new_section": "479",
        "new_title": "Maximum period for which an undertrial prisoner can be detained",
        "category": "Bail",
        "change_notes": "Major relief: A first-time offender (never previously convicted of any offence) shall be released on bond/bail after serving one-third of the maximum imprisonment period."
    },
    {
        "old_code": "CrPC",
        "old_section": "437",
        "old_title": "When bail may be taken in case of non-bailable offence",
        "new_code": "BNSS",
        "new_section": "480",
        "new_title": "When bail may be taken in non-bailable offence",
        "category": "Bail",
        "change_notes": "Discretion of Magistrate. Proviso allows bail to women, sick, infirm, or persons under 16."
    },
    {
        "old_code": "CrPC",
        "old_section": "438",
        "old_title": "Direction for grant of bail to person apprehending arrest (Anticipatory Bail)",
        "new_code": "BNSS",
        "new_section": "482",
        "new_title": "Direction for grant of bail to person apprehending arrest",
        "category": "Bail",
        "change_notes": "Sessions Court and High Court retain anticipatory bail jurisdiction. Clarifications on conditions regarding presence at interrogation."
    },
    {
        "old_code": "CrPC",
        "old_section": "439",
        "old_title": "Special powers of High Court or Court of Session regarding bail",
        "new_code": "BNSS",
        "new_section": "483",
        "new_title": "Special powers of High Court or Court of Session regarding bail",
        "category": "Bail",
        "change_notes": "Concurrent power of Sessions Court and High Court for regular bail and cancellation of bail."
    },
    {
        "old_code": "CrPC",
        "old_section": "482",
        "old_title": "Saving of inherent powers of High Court",
        "new_code": "BNSS",
        "new_section": "528",
        "new_title": "Saving of inherent powers of High Court",
        "category": "Inherent Powers",
        "change_notes": "High Court's inherent jurisdiction to prevent abuse of process of any court or secure ends of justice (quashing FIRs, criminal complaints)."
    }
]


IEA_TO_BSA: List[Dict[str, Any]] = [
    {
        "old_code": "IEA",
        "old_section": "3",
        "old_title": "Interpretation clause ('Evidence', 'Document', 'Proved')",
        "new_code": "BSA",
        "new_section": "2",
        "new_title": "Definitions",
        "category": "Preliminary",
        "change_notes": "Document definition expanded to include electronic records, digital emails, server logs, smartphone messages, location data."
    },
    {
        "old_code": "IEA",
        "old_section": "24 / 25 / 26",
        "old_title": "Confession caused by inducement / Confession to police officer not to be proved",
        "new_code": "BSA",
        "new_section": "22 / 23",
        "new_title": "Confession when irrelevant / Confession to police officer",
        "category": "Confessions",
        "change_notes": "Confessions to police officers continue to be inadmissible as substantive evidence."
    },
    {
        "old_code": "IEA",
        "old_section": "27",
        "old_title": "How much of information received from accused may be proved (Discovery of fact)",
        "new_code": "BSA",
        "new_section": "23(2)",
        "new_title": "Information leading to discovery of fact",
        "category": "Confessions",
        "change_notes": "Integrated directly into Section 23 as a proviso/exception for facts discovered in consequence of information given by accused."
    },
    {
        "old_code": "IEA",
        "old_section": "32(1)",
        "old_title": "Cases in which statement of relevant fact by person who is dead is relevant (Dying Declaration)",
        "new_code": "BSA",
        "new_section": "26(a)",
        "new_title": "Statements by persons who cannot be called as witnesses (Dying declaration)",
        "category": "Statements",
        "change_notes": "Substantively identical legal standard for admissibility of dying declarations regarding cause of death."
    },
    {
        "old_code": "IEA",
        "old_section": "45",
        "old_title": "Opinions of experts",
        "new_code": "BSA",
        "new_section": "39",
        "new_title": "Opinions of experts",
        "category": "Expert Opinion",
        "change_notes": "Broadened beyond science/art to include digital/cyber forensics and electronic device analysis experts."
    },
    {
        "old_code": "IEA",
        "old_section": "61 / 62 / 63",
        "old_title": "Proof of contents of documents (Primary and Secondary Evidence)",
        "new_code": "BSA",
        "new_section": "56 / 57 / 58",
        "new_title": "Proof of documents, Primary evidence, Secondary evidence",
        "category": "Documentary Evidence",
        "change_notes": "Section 57 explicitly categorizes digital storage media and synchronized clouds as primary documents."
    },
    {
        "old_code": "IEA",
        "old_section": "65B",
        "old_title": "Admissibility of electronic records (Certificate requirement)",
        "new_code": "BSA",
        "new_section": "63",
        "new_title": "Admissibility of electronic records and certificate requirement",
        "category": "Electronic Evidence",
        "change_notes": "Section 63 outlines electronic admissibility. Schedule provides a standardized statutory certificate format for electronic records."
    },
    {
        "old_code": "IEA",
        "old_section": "101 / 102",
        "old_title": "Burden of proof / On whom burden of proof lies",
        "new_code": "BSA",
        "new_section": "104 / 105",
        "new_title": "Burden of proof / On whom burden of proof lies",
        "category": "Burden of Proof",
        "change_notes": "Standard of proof in criminal trials remains beyond reasonable doubt on prosecution."
    },
    {
        "old_code": "IEA",
        "old_section": "113B",
        "old_title": "Presumption as to dowry death",
        "new_code": "BSA",
        "new_section": "118",
        "new_title": "Presumption as to dowry death",
        "category": "Presumptions",
        "change_notes": "Court shall presume dowry death if shown that woman was subjected to cruelty/harassment for dowry soon before death."
    },
    {
        "old_code": "IEA",
        "old_section": "115",
        "old_title": "Estoppel",
        "new_code": "BSA",
        "new_section": "121",
        "new_title": "Estoppel",
        "category": "Estoppel",
        "change_notes": "When one person by declaration, act or omission intentionally caused another to believe a thing to be true."
    }
]


def build_concordance_master() -> Dict[str, Any]:
    """Builds a bidirectional index for ultra-fast RAG resolution."""
    ipc_to_bns_map = {}
    bns_to_ipc_map = {}
    crpc_to_bnss_map = {}
    bnss_to_crpc_map = {}
    iea_to_bsa_map = {}
    bsa_to_iea_map = {}

    for item in IPC_TO_BNS:
        old_sec = str(item["old_section"]).strip()
        new_sec = str(item["new_section"]).strip()
        ipc_to_bns_map[f"IPC_{old_sec}"] = item
        bns_to_ipc_map[f"BNS_{new_sec}"] = item

    for item in CRPC_TO_BNSS:
        old_sec = str(item["old_section"]).strip()
        new_sec = str(item["new_section"]).strip()
        crpc_to_bnss_map[f"CrPC_{old_sec}"] = item
        bnss_to_crpc_map[f"BNSS_{new_sec}"] = item

    for item in IEA_TO_BSA:
        old_sec = str(item["old_section"]).strip()
        new_sec = str(item["new_section"]).strip()
        iea_to_bsa_map[f"IEA_{old_sec}"] = item
        bsa_to_iea_map[f"BSA_{new_sec}"] = item

    master = {
        "metadata": {
            "effective_date": "2024-07-01",
            "statutory_transition_rule": "Under Article 20(1) of the Constitution of India, substantive criminal offences apply prospectively. Offences committed prior to July 1, 2024 continue under IPC; offences on or after July 1, 2024 are registered under BNS. Procedural provisions under BNSS and evidentiary rules under BSA apply as per Supreme Court transition guidelines.",
            "total_ipc_bns_mappings": len(IPC_TO_BNS),
            "total_crpc_bnss_mappings": len(CRPC_TO_BNSS),
            "total_iea_bsa_mappings": len(IEA_TO_BSA)
        },
        "ipc_to_bns": ipc_to_bns_map,
        "bns_to_ipc": bns_to_ipc_map,
        "crpc_to_bnss": crpc_to_bnss_map,
        "bnss_to_crpc": bnss_to_crpc_map,
        "iea_to_bsa": iea_to_bsa_map,
        "bsa_to_iea": bsa_to_iea_map
    }
    return master


def main():
    os.makedirs(MAPPINGS_DIR, exist_ok=True)

    with open(os.path.join(MAPPINGS_DIR, "bns_ipc_mapping.json"), "w", encoding="utf-8") as f:
        json.dump(IPC_TO_BNS, f, indent=2)

    with open(os.path.join(MAPPINGS_DIR, "bnss_crpc_mapping.json"), "w", encoding="utf-8") as f:
        json.dump(CRPC_TO_BNSS, f, indent=2)

    with open(os.path.join(MAPPINGS_DIR, "bsa_iea_mapping.json"), "w", encoding="utf-8") as f:
        json.dump(IEA_TO_BSA, f, indent=2)

    master = build_concordance_master()
    with open(os.path.join(MAPPINGS_DIR, "statutory_concordance_master.json"), "w", encoding="utf-8") as f:
        json.dump(master, f, indent=2)

    print(f"Generated mappings successfully in {MAPPINGS_DIR}:")
    print(f" - IPC <-> BNS: {len(IPC_TO_BNS)} entries")
    print(f" - CrPC <-> BNSS: {len(CRPC_TO_BNSS)} entries")
    print(f" - IEA <-> BSA: {len(IEA_TO_BSA)} entries")
    print(f" - Master concordance index: {len(master['ipc_to_bns']) + len(master['crpc_to_bnss']) + len(master['iea_to_bsa'])} bidirectional entries")


if __name__ == "__main__":
    main()
