"""
Legal Saathi - Intent & Issue Classifier (classifier.py)
Classifies user grievances into the 15 comprehensive Indian legal domains,
assesses urgency, supports multi-label classification, and short-circuits critical emergencies.
Strictly eliminates tenancy/landlord false-positive bias.
"""

import re
from typing import Dict, Any, List, Optional, Tuple
from backend.schemas.classify import ClassifyResponse


# Comprehensive 15 Legal Domains Taxonomy
DOMAIN_DISPLAY_NAMES = {
    "property_rera": "Property & Housing - Builder Delay & Real Estate",
    "tenancy": "Property & Housing - Landlord & Tenant",
    "banking_finance": "Financial & Banking Disputes",
    "labor": "Employment & Labour Law",
    "consumer": "Consumer Protection & E-Commerce",
    "cyber_fraud": "Cybercrime & Digital Fraud",
    "family_domestic": "Family & Personal Law",
    "criminal": "Criminal Law & Personal Safety",
    "women_child": "Women & Child Protection",
    "civil_contract": "Civil & Contractual Disputes",
    "education": "Education & Student Rights",
    "government_public": "Government Services & Public Grievances",
    "welfare_identity": "Identity, Benefits & Social Welfare",
    "healthcare": "Healthcare & Medical Services",
    "legal_aid": "Legal Rights & Free Legal Aid",
    "general": "General Legal Assistance"
}

# Extensive bilingual and English keyword patterns across all 15 domains
ISSUE_PATTERNS: Dict[str, List[str]] = {
    "property_rera": [
        r"builder", r"buyer", r"possession", r"bba", r"builder-buyer", r"delayed possession",
        r"rera", r"hrera", r"up rera", r"maharera", r"promoter", r"allottee", r"apartment",
        r"flat booking", r"super area", r"carpet area", r"occupancy certificate", r"completion certificate",
        r"construction delay", r"structural defect", r"escalation charges", r"tower", r"society handover",
        r"बिल्डर", r"कब्जा", r"रेरा", r"फ्लैट"
    ],
    "tenancy": [
        r"\btenant\b", r"\btenants\b", r"\blandlord\b", r"\blandlords\b", r"\brent\b", r"\brented\b",
        r"\brental\b", r"\blease deed\b", r"\bsecurity deposit\b", r"\beviction\b", r"\bevict\b",
        r"model tenancy act", r"rent agreement", r"rent control", r"lockout", r"water cut by landlord",
        r"electricity cut by landlord", r"किराया", r"किरायेदार", r"मकानमालिक"
    ],
    "banking_finance": [
        r"\bloan\b", r"\bbank\b", r"\bemi\b", r"recovery agent", r"debt collection", r"harassment by recovery",
        r"unauthorized debit", r"cheque bounce", r"section 138", r"negotiable instruments", r"insurance claim",
        r"claim rejected", r"credit card overcharge", r"cibil score", r"banking ombudsman", r"rbi complaint",
        r"ऋण", r"बैंक", r"चेक बाउंस", r"बीमा"
    ],
    "labor": [
        r"salary unpaid", r"unpaid salary", r"withheld salary", r"unpaid wages", r"provident fund",
        r"pf withdrawal", r"epfo", r"wrongful termination", r"fired without notice", r"gratuity",
        r"severance", r"labour court", r"industrial disputes", r"code on wages", r"overtime unpaid",
        r"workplace harassment", r"boss refused to pay", r"वेतन", r"नौकरी", r"मजदूरी"
    ],
    "consumer": [
        r"consumer", r"defective", r"warranty", r"refund", r"amazon", r"flipkart",
        r"e-commerce", r"service center", r"poor service", r"replacement", r"unfair trade",
        r"misleading advert", r"overcharging", r"expired goods", r"seller", r"laptop",
        r"deficiency of service", r"consumer court", r"e-daakhil", r"order", r"product",
        r"उपभोक्ता", r"वारंटी", r"रिफंड"
    ],

    "cyber_fraud": [
        r"cyber", r"cybercrime", r"otp fraud", r"hacked", r"unauthorized.*transaction", r"\bupi\b", r"upi scam",
        r"phishing", r"credit card fraud", r"bank account emptied", r"telegram scam", r"part-time job scam",
        r"task scam", r"fake app", r"1930", r"cyber police", r"identity theft", r"deepfake",
        r"साइबर", r"ओटीपी", r"धोखाधड़ी"
    ],
    "family_domestic": [
        r"domestic violence", r"beating", r"husband abuse", r"in-laws", r"dowry", r"section 498a",
        r"maintenance", r"section 125 crpc", r"section 144 bnss", r"custody of child", r"divorce",
        r"mutual divorce", r"matrimonial dispute", r"alimony", r"protection order", r"घरेलू हिंसा", r"तलाक"
    ],
    "criminal": [
        r"police fir", r"assault", r"physical attack", r"beaten", r"threat to kill", r"intimidation",
        r"theft", r"stolen", r"robbery", r"burglary", r"criminal breach of trust", r"cheating",
        r"section 420", r"section 318 bns", r"extortion", r"stalking", r"criminal intimidation",
        r"मारपीट", r"धमकी", r"चोरी", r"थाना", r"एफआईआर"
    ],
    "women_child": [
        r"posh", r"sexual harassment", r"workplace sexual harassment", r"internal complaints committee",
        r"icc", r"child abuse", r"pocso", r"child custody", r"child labour", r"juvenile justice",
        r"महिला उत्पीड़न", r"यौन उत्पीड़न"
    ],
    "civil_contract": [
        r"breach of contract", r"agreement violated", r"vendor dispute", r"partnership dispute",
        r"specific performance", r"damages", r"compensation", r"negligence", r"mou", r"commercial dispute",
        r"अनुबंध", r"समझौता", r"मुआवजा"
    ],
    "education": [
        r"\bcollege\b", r"\buniversity\b", r"\bschool\b", r"\badmission\b", r"college fee", r"school fee", r"fee refund", r"admission denied", r"degree withheld",
        r"marksheet withheld", r"ragging", r"university grievance", r"ugc complaint", r"scholarship withheld",
        r"फीस", r"कॉलेज", r"विश्वविद्यालय"
    ],
    "government_public": [
        r"rti", r"right to information", r"public authority", r"pio", r"cpio", r"first appeal",
        r"government delay", r"municipal corporation", r"ration card delay", r"water connection delay",
        r"property tax dispute", r"delhi jal board", r"electricity board", r"सूचना का अधिकार"
    ],
    "welfare_identity": [
        r"pension", r"epfo pension", r"old age pension", r"aadhaar update", r"voter id", r"pds ration",
        r"bpl card", r"pm kisan", r"social security", r"disability certificate", r"पेंशन", r"आधार"
    ],
    "healthcare": [
        r"\bhospital\b", r"\bpatient\b", r"\bdoctor\b", r"\bmedical\b", r"medical negligence", r"doctor negligence", r"hospital overcharging", r"wrong diagnosis",
        r"patient death due to negligence", r"clinical establishment", r"medical council",
        r"चिकित्सा लापरवाही", r"अस्पताल", r"मरीज"
    ],
    "legal_aid": [
        r"free legal aid", r"dlsa", r"slsa", r"nalsa", r"article 39a", r"cannot afford lawyer",
        r"free lawyer", r"legal services authority", r"15100", r"कानूनी सहायता"
    ]
}

# Emergency Patterns (Immediate safety alerts)
EMERGENCY_PATTERNS = [
    (r"kill|murder|threaten.*life|physical assault|bleeding|in immediate danger|locked me in|send police",
     "Physical Danger / Emergency Police Assistance required immediately.",
     "112 (National Emergency Helpline)"),
    (r"domestic violence|husband.*beat|in-laws.*beat|husband is beating|throwing me out tonight|physical violence at home",
     "Domestic Violence Emergency Hotline.",
     "181 (Women Helpline) / 112"),
    (r"just shared otp|money just deducted right now|account emptied just now|transferred money to scammer 5 mins ago",
     "Active Cyber Financial Fraud (Golden Hour freeze).",
     "1930 (National Cyber Crime Reporting Helpline)"),
    (r"cutting power right now|lockout right now|threw my bags on road right now|illegal force eviction in progress",
     "Illegal Forceful Eviction in progress.",
     "112 (Police) / 15100 (DLSA Free Legal Aid)")
]

# Authoritative Act References per Domain
APPLICABLE_ACTS_MAP: Dict[str, List[str]] = {
    "property_rera": [
        "Real Estate (Regulation and Development) Act, 2016 (Section 18, 19, 31)",
        "Consumer Protection Act, 2019 (Deficiency in Housing Service)",
        "Specific Relief Act, 1963"
    ],
    "tenancy": [
        "Model Tenancy Act, 2021 (Section 10, 11, 20, 21)",
        "Transfer of Property Act, 1882 (Section 106, 108)",
        "State Rent Control Legislation"
    ],
    "banking_finance": [
        "Negotiable Instruments Act, 1881 (Section 138)",
        "Reserve Bank of India (RBI) Integrated Ombudsman Scheme, 2021",
        "Consumer Protection Act, 2019 (Banking Deficiency)"
    ],
    "labor": [
        "Code on Wages, 2019 / Payment of Wages Act, 1936",
        "Industrial Disputes Act, 1947 (Section 2A, 33C)",
        "Employees' Provident Funds and Miscellaneous Provisions Act, 1952"
    ],
    "consumer": [
        "Consumer Protection Act, 2019 (Section 2(11), 2(47), 35, 38)",
        "Consumer Protection (E-Commerce) Rules, 2020"
    ],
    "cyber_fraud": [
        "Information Technology Act, 2000 (Section 43, 66C, 66D)",
        "Bharatiya Nyaya Sanhita, 2023 (Section 318 - Cheating, Section 316 - Breach of Trust)"
    ],
    "family_domestic": [
        "Protection of Women from Domestic Violence Act, 2005 (Section 12, 18, 19, 20)",
        "Bharatiya Nagarik Suraksha Sanhita, 2023 (Section 144 - Maintenance)",
        "Hindu Marriage Act, 1955 / Special Marriage Act, 1954"
    ],
    "criminal": [
        "Bharatiya Nyaya Sanhita, 2023 (BNS)",
        "Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS Section 173 - FIR)",
        "Bharatiya Sakshya Adhiniyam, 2023 (BSA)"
    ],
    "women_child": [
        "Sexual Harassment of Women at Workplace (PREVENTION, PROHIBITION AND REDRESSAL) Act, 2013 (POSH)",
        "Protection of Children from Sexual Offences Act, 2012 (POCSO)"
    ],
    "civil_contract": [
        "Indian Contract Act, 1872 (Section 73, 74 - Damages for Breach)",
        "Specific Relief Act, 1963 (Section 10, 14, 20)"
    ],
    "education": [
        "University Grants Commission (Grievance Redressal) Regulations",
        "Consumer Protection Act, 2019 (Unfair Educational Service)"
    ],
    "government_public": [
        "Right to Information Act, 2005 (Section 6(1), 7(1), 19)",
        "Public Services Guarantee Acts (State Specific)"
    ],
    "welfare_identity": [
        "Aadhaar (Targeted Delivery of Financial and Other Subsidies, Benefits and Services) Act, 2016",
        "National Food Security Act, 2013",
        "Employees' Pension Scheme, 1995"
    ],
    "healthcare": [
        "Consumer Protection Act, 2019 (Medical Negligence Standards under Jacob Mathew)",
        "Clinical Establishments (Registration and Regulation) Act, 2010"
    ],
    "legal_aid": [
        "Legal Services Authorities Act, 1987 (Section 12 - Free Legal Aid Eligibility)",
        "Constitution of India (Article 39A - Equal Justice and Free Legal Aid)"
    ],
    "general": [
        "Constitution of India (Fundamental Rights)",
        "Legal Services Authorities Act, 1987 (NALSA / DLSA Assistance)"
    ]
}


class IssueClassifier:
    """
    Production-grade rule-based and heuristic classifier spanning 15 Indian legal domains.
    Provides strict disambiguation, multi-label secondary issue ranking, and emergency triage.
    """

    def classify(self, text: str, lang: str = "en") -> ClassifyResponse:
        lower_text = text.lower()

        # 1. Immediate Emergency Check
        for pattern, explanation, helpline in EMERGENCY_PATTERNS:
            if re.search(pattern, lower_text):
                return ClassifyResponse(
                    issue_type="criminal",
                    domain="Criminal Law & Personal Safety",
                    secondary_issues=["emergency_critical"],
                    urgency="emergency",
                    is_emergency=True,
                    confidence=0.98,
                    explanation=f"CRITICAL EMERGENCY DETECTED: {explanation}",
                    applicable_acts=["Bharatiya Nyaya Sanhita, 2023", "Police Emergency Powers"],
                    emergency_helpline=helpline
                )

        # 2. Score All 15 Issue Types
        scores: Dict[str, int] = {}
        for issue_type, patterns in ISSUE_PATTERNS.items():
            matched_count = 0
            for p in patterns:
                if re.search(p, lower_text):
                    # Give higher weight to explicit domain indicators like 'builder', 'possession', 'bba'
                    if issue_type == "property_rera" and any(k in p for k in ["builder", "possession", "rera", "bba"]):
                        matched_count += 3
                    elif issue_type == "tenancy" and any(k in p for k in ["landlord", "rent", "tenant"]):
                        matched_count += 2
                    elif issue_type == "cyber_fraud" and any(k in p for k in ["upi", "hacked", "1930", "phishing", "cyber", "otp"]):
                        matched_count += 3
                    elif issue_type == "education" and any(k in p for k in ["college", "school", "admission", "degree", "ugc"]):
                        matched_count += 3
                    elif issue_type == "healthcare" and any(k in p for k in ["hospital", "patient", "medical", "doctor", "clinic"]):
                        matched_count += 3
                    else:
                        matched_count += 1
            if matched_count > 0:
                scores[issue_type] = matched_count

        # 3. Disambiguation: Builder/Buyer vs Tenancy
        # If text explicitly mentions builder/possession/buyer/rera, suppress accidental tenancy triggers
        is_builder_dispute = bool(re.search(r"builder|buyer|possession|bba|rera|flat booking|allottee", lower_text))
        if is_builder_dispute and "property_rera" in scores:
            scores["property_rera"] = scores.get("property_rera", 0) + 5
            # Zero out tenancy unless 'landlord' or 'rented' is explicitly mentioned as the primary counter-party
            if not re.search(r"\blandlord\b|\brented out to tenant\b", lower_text):
                scores.pop("tenancy", None)

        if not scores:
            selected_type = "general"
            secondary: List[str] = []
            confidence = 0.50
            explanation = "General legal guidance under Indian law."
        else:
            # Sort domains by score
            sorted_issues = sorted(scores.items(), key=lambda x: x[1], reverse=True)
            selected_type = sorted_issues[0][0]
            secondary = [item[0] for item in sorted_issues[1:4]]
            match_count = sorted_issues[0][1]
            confidence = min(0.96, 0.65 + (match_count * 0.08))
            explanation = f"Classified under {DOMAIN_DISPLAY_NAMES.get(selected_type, selected_type)} based on {match_count} legal markers."

        # 4. Urgency Assessment
        urgency: Any = "medium"
        if re.search(r"urgent|immediate|notice received|15 days|hearing|tomorrow|court date|police|arrest|threat", lower_text):
            urgency = "high"
        elif re.search(r"how to|what is|procedure|information|query|general|rules for", lower_text):
            urgency = "low"

        acts = APPLICABLE_ACTS_MAP.get(selected_type, APPLICABLE_ACTS_MAP["general"])
        domain_name = DOMAIN_DISPLAY_NAMES.get(selected_type, "General Legal Assistance")

        return ClassifyResponse(
            issue_type=selected_type,
            domain=domain_name,
            secondary_issues=secondary,
            urgency=urgency,
            is_emergency=False,
            confidence=round(confidence, 2),
            explanation=explanation,
            applicable_acts=acts,
            emergency_helpline=None
        )


classifier = IssueClassifier()
