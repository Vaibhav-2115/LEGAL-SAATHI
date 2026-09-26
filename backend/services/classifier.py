"""
Legal Saathi - Intent & Issue Classifier (classifier.py)
Classifies user grievance into legal issue taxonomy, assesses urgency,
and short-circuits critical emergencies (domestic violence, physical threats, active cyber fraud).
"""

import re
from typing import Dict, Any, List
from backend.schemas.classify import ClassifyResponse


# Taxonomy Keywords & Regex Patterns
ISSUE_PATTERNS = {
    "consumer": [
        r"consumer", r"defective", r"warranty", r"refund", r"amazon", r"flipkart",
        r"service center", r"poor service", r"replacement", r"unfair trade", r"bill",
        r"overcharging", r"expired goods", r"deficiency of service", r"customer care",
        r"damaged", r"cracked", r"return policy", r"return"
    ],
    "property_rera": [
        r"rera", r"builder", r"possession", r"flat", r"apartment", r"allottee",
        r"delay in possession", r"booking amount", r"super area", r"carpet area",
        r"occupancy certificate", r"construction quality", r"structural defect", r"developer"
    ],
    "tenancy": [
        r"rent", r"landlord", r"tenant", r"evict", r"eviction", r"security deposit",
        r"electricity cut", r"water cut", r"tenancy agreement", r"lease", r"broker",
        r"maintenance charge", r"notice period", r"lockout"
    ],
    "rti": [
        r"rti", r"right to information", r"public authority", r"pio", r"cpio",
        r"government office", r"pending file", r"information request", r"tender details",
        r"first appeal", r"48 hours", r"30 days"
    ],
    "cyber_fraud": [
        r"cyber", r"otp", r"hacked", r"unauthorized transaction", r"upi scam",
        r"phishing", r"credit card fraud", r"bank account emptied", r"telegram scam",
        r"task scam", r"fake app", r"1930", r"cybercrime"
    ],
    "family_domestic": [
        r"domestic violence", r"beating", r"husband abuse", r"in-laws", r"dowry",
        r"maintenance", r"custody", r"divorce", r"harassment at home", r"protection order"
    ],
    "labor": [
        r"salary unpaid", r"unpaid wages", r"provident fund", r"pf withdrawal",
        r"wrongful termination", r"fired without notice", r"gratuity", r"employer harassment"
    ]
}

# Emergency Patterns (Short-circuit triggers)
EMERGENCY_PATTERNS = [
    (r"kill|murder|threaten|physical violence|physical assault|assault|beating|beaten|bleeding|immediate danger|locked me|send police", "Physical Danger / Police Assistance required immediately.", "112 (National Emergency Helpline)"),
    (r"domestic violence|hit me|throwing me out tonight|husband.*beat|in-laws.*beat", "Domestic Violence Emergency Helpline.", "181 (Women Helpline) / 112"),
    (r"just shared otp|money just deducted|account emptied|unauthorized transaction right now|transferred.*scam", "Cyber Financial Fraud (Golden Hour freeze).", "1930 (Cyber Crime Helpline)"),
    (r"cutting power right now|lockout right now|threw bags outside|illegal eviction right now", "Illegal Forceful Eviction in progress.", "112 (Police) / 15100 (DLSA Legal Aid)")
]

APPLICABLE_ACTS_MAP = {
    "consumer": ["Consumer Protection Act, 2019 (Section 2(11), 2(47), 35)"],
    "property_rera": ["Real Estate (Regulation and Development) Act, 2016 (Section 18, 14, 11)"],
    "tenancy": ["Model Tenancy Act, 2021 (Section 10, 20, 21) / State Rent Control Act"],
    "rti": ["Right to Information Act, 2005 (Section 6(1), 7(1), 19)"],
    "cyber_fraud": ["Information Technology Act, 2000 (Section 66D) & BNS Section 318 (Cheating)"],
    "family_domestic": ["Protection of Women from Domestic Violence Act, 2005 (Section 12, 18, 19)"],
    "labor": ["Industrial Disputes Act, 1947 & Code on Wages, 2019"],
    "general": ["Legal Services Authorities Act, 1987 (Free Legal Aid Section 12)"]
}


class IssueClassifier:
    """
    Rule-based and heuristic issue classifier with instant emergency routing.
    """

    def classify(self, text: str, lang: str = "en") -> ClassifyResponse:
        lower_text = text.lower()

        # 1. Check for Immediate Emergency
        for pattern, explanation, helpline in EMERGENCY_PATTERNS:
            if re.search(pattern, lower_text):
                return ClassifyResponse(
                    issue_type="emergency_critical",
                    urgency="emergency",
                    is_emergency=True,
                    confidence=0.98,
                    explanation=f"CRITICAL EMERGENCY DETECTED: {explanation}",
                    applicable_acts=["Bharatiya Nyaya Sanhita, 2023", "Police Emergency Powers"],
                    emergency_helpline=helpline
                )

        # 2. Score Issue Types
        scores: Dict[str, int] = {}
        for issue_type, patterns in ISSUE_PATTERNS.items():
            score = sum(1 for p in patterns if re.search(p, lower_text))
            if score > 0:
                scores[issue_type] = score

        if not scores:
            selected_type = "general"
            confidence = 0.50
            explanation = "General legal guidance under Indian law."
        else:
            selected_type = max(scores, key=scores.get)
            match_count = scores[selected_type]
            confidence = min(0.95, 0.60 + (match_count * 0.10))
            explanation = f"Matched {match_count} legal keywords for {selected_type.replace('_', ' ').title()}."

        # 3. Urgency determination
        urgency = "medium"
        if re.search(r"urgent|immediate|notice received|15 days|hearing|tomorrow|court date|police", lower_text):
            urgency = "high"
        elif re.search(r"how to|what is|procedure|information|query|general", lower_text):
            urgency = "low"

        acts = APPLICABLE_ACTS_MAP.get(selected_type, APPLICABLE_ACTS_MAP["general"])

        return ClassifyResponse(
            issue_type=selected_type,
            urgency=urgency,
            is_emergency=False,
            confidence=round(confidence, 2),
            explanation=explanation,
            applicable_acts=acts,
            emergency_helpline=None
        )


classifier = IssueClassifier()
