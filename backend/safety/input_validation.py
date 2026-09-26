"""
Legal Saathi - Input Validation & Complaint Quality Engine (SEC-003)
Enforces payload limits, trims whitespace, cleans input fields, and performs
strict input validation against gibberish, out-of-scope queries, and invalid complaints.
Implements the 7 official Data Quality States:
- VALID
- VALID_BUT_INCOMPLETE
- NEEDS_CLARIFICATION
- INVALID
- OUT_OF_SCOPE
- POTENTIALLY_SENSITIVE
- REQUIRES_HUMAN_REVIEW
"""

from enum import Enum
import math
import os
import re
from typing import Any, Dict, List, Optional
from fastapi import HTTPException, status
from backend.core.config import settings


class DataQualityState(str, Enum):
    VALID = "VALID"
    VALID_BUT_INCOMPLETE = "VALID_BUT_INCOMPLETE"
    NEEDS_CLARIFICATION = "NEEDS_CLARIFICATION"
    INVALID = "INVALID"
    OUT_OF_SCOPE = "OUT_OF_SCOPE"
    POTENTIALLY_SENSITIVE = "POTENTIALLY_SENSITIVE"
    REQUIRES_HUMAN_REVIEW = "REQUIRES_HUMAN_REVIEW"


# Common keyboard mash sequence runs
KEYBOARD_MASH_RUNS = [
    "asdf", "dfgh", "ghjk", "hjkl", "lkjh", "kjhg", "hgfd", "gfds", "fdsa",
    "qwer", "wert", "erty", "rtyu", "tyui", "yuio", "uiop", "poiuy", "oiuyt", "iuytr", "uytre", "ytrew", "trewq",
    "zxcv", "xcvb", "cvbn", "vbnm", "mnbv", "nbvc", "bvcx", "vcxz"
]

OUT_OF_SCOPE_PATTERNS = [
    r"weather in \w+",
    r"cricket score",
    r"recipe for \w+",
    r"movie tickets",
    r"who won the match",
    r"tell me a joke",
    r"write a poem about",
    r"capital of \w+"
]

POTENTIALLY_SENSITIVE_PATTERNS = [
    r"suicide|kill myself|end my life|self harm",
    r"national defense secret|military movement|nuclear facility"
]

LEGAL_KEYWORDS_BROAD = {
    "court", "notice", "law", "act", "section", "refund", "deposit", "rent", "tenant",
    "landlord", "builder", "flat", "apartment", "salary", "wage", "employer", "employee",
    "fired", "terminated", "fraud", "scam", "police", "fir", "complaint", "agreement",
    "contract", "cheque", "bank", "loan", "consumer", "defective", "warranty", "order",
    "delivery", "possession", "delay", "rera", "rti", "divorce", "maintenance", "dowry",
    "harassment", "beaten", "assault", "threat", "theft", "stolen", "property", "money",
    "rupees", "paid", "withheld", "denied", "claim", "damage", "dispute", "rights", "aid",
    "वकील", "कानून", "थाना", "कोर्ट", "वेतन", "मकान", "बिल्डर", "धोखा", "पैसे", "शिकायत"
}


def is_gibberish(text: str) -> bool:
    """Detects random characters, keyboard mashing, or high-entropy gibberish."""
    cleaned = text.strip().lower()
    
    # Check for empty or single char
    if len(cleaned) < 2:
        return True

    # 1. Check excessive repeated characters (e.g., 'aaaaaa', 'zzzzzz')
    if re.search(r"(.)\1{4,}", cleaned):
        return True

    # 2. Check pure keyboard mash sequences (e.g. asdfghjkl, qwertyuiop, zxcvbnm)
    words = cleaned.split()
    for w in words:
        clean_word = re.sub(r"[^a-zA-Z]", "", w)
        if len(clean_word) >= 5:
            if any(run in clean_word for run in KEYBOARD_MASH_RUNS):
                return True

    # 3. Check vowel-to-consonant anomaly for purely English words > 5 chars without vowels
    for w in words:
        alpha = re.sub(r"[^a-zA-Z]", "", w)
        if len(alpha) >= 6 and not any(v in alpha for v in "aeiouy"):
            return True

    # 4. Check if text is only punctuation or numbers
    if re.match(r"^[\W\d_]+$", cleaned):
        return True

    return False


def assess_complaint_quality(text: Optional[str]) -> Dict[str, Any]:
    """
    Evaluates text quality and maps into official Data Quality States.
    Determines whether a finalized report or complaint may be generated.
    """
    if not text or not text.strip():
        return {
            "state": DataQualityState.INVALID,
            "is_valid": False,
            "can_finalize": False,
            "reason": "Input is empty or whitespace only.",
            "clarifying_questions": ["Please state the legal issue or grievance you are facing."]
        }

    cleaned = text.strip()
    lower = cleaned.lower()

    # Check for gibberish
    if is_gibberish(cleaned):
        return {
            "state": DataQualityState.INVALID,
            "is_valid": False,
            "can_finalize": False,
            "reason": "Input appears to be random or meaningless text.",
            "clarifying_questions": [
                "Please describe what occurred in your own words (e.g. what was purchased, who withheld funds, or what dispute arose)."
            ]
        }

    # Check for potentially sensitive emergency
    for pat in POTENTIALLY_SENSITIVE_PATTERNS:
        if re.search(pat, lower):
            return {
                "state": DataQualityState.POTENTIALLY_SENSITIVE,
                "is_valid": True,
                "can_finalize": False,
                "reason": "Text touches on emergency safety or sensitive crisis.",
                "clarifying_questions": [
                    "If you are in immediate danger or facing acute personal crisis, please reach out to national helpline 112 or Tele-MANAS (14416)."
                ]
            }

    # Check for out-of-scope non-legal queries
    for pat in OUT_OF_SCOPE_PATTERNS:
        if re.search(pat, lower):
            return {
                "state": DataQualityState.OUT_OF_SCOPE,
                "is_valid": False,
                "can_finalize": False,
                "reason": "Query is outside the scope of Indian legal and administrative grievances.",
                "clarifying_questions": [
                    "Legal Saathi assists with civil, consumer, tenancy, property, labor, cyber, and statutory legal rights under Indian law. How can we help with your legal matter?"
                ]
            }

    words = cleaned.split()
    word_count = len(words)

    # Check if input contains at least one legal or factual domain anchor
    has_legal_anchor = any(
        kw in lower for kw in LEGAL_KEYWORDS_BROAD
    ) or any(
        w in LEGAL_KEYWORDS_BROAD for w in words
    )

    # Legitimate brief complaints (e.g., "My salary was withheld for 2 months")
    if word_count < 8:
        if has_legal_anchor:
            return {
                "state": DataQualityState.VALID_BUT_INCOMPLETE,
                "is_valid": True,
                "can_finalize": False,
                "reason": "The complaint identifies a recognized legal issue, but essential dates, amounts, or opposing party details are needed before finalization.",
                "clarifying_questions": [
                    "What is the total amount or claim involved?",
                    "On what date did this incident or non-compliance occur?",
                    "Have you served any prior written communication or demand to the other party?"
                ]
            }
        else:
            return {
                "state": DataQualityState.NEEDS_CLARIFICATION,
                "is_valid": True,
                "can_finalize": False,
                "reason": "The description is too brief to evaluate the applicable legal provisions.",
                "clarifying_questions": [
                    "Who is the opposing party (builder, employer, seller, landlord, or authority)?",
                    "What specific harm, loss, or contractual non-fulfillment occurred?"
                ]
            }

    # If substantial complaint text provided
    if has_legal_anchor or word_count >= 15:
        # Check if dates or amounts or parties are present
        has_dates = bool(re.search(r"\b(19\d\d|20\d\d|\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|january|february|march|april|may|june|july|august|september|october|november|december|months?|days?|years?)\b", lower))
        has_party = bool(re.search(r"builder|landlord|company|employer|bank|seller|amazon|flipkart|dealer|hospital|police|tenant", lower))

        if has_dates and has_party:
            return {
                "state": DataQualityState.VALID,
                "is_valid": True,
                "can_finalize": True,
                "reason": "Complaint contains sufficient factual foundation for preliminary statutory assessment.",
                "clarifying_questions": []
            }
        else:
            return {
                "state": DataQualityState.VALID_BUT_INCOMPLETE,
                "is_valid": True,
                "can_finalize": False,
                "reason": "Valid legal complaint recorded; supporting evidence or specific milestone dates will strengthen statutory notices.",
                "clarifying_questions": [
                    "Please verify the opposing party's legal or registered name.",
                    "Upload or record any written correspondence (WhatsApp, email, or formal letter) confirming the dispute."
                ]
            }

    return {
        "state": DataQualityState.NEEDS_CLARIFICATION,
        "is_valid": True,
        "can_finalize": False,
        "reason": "Additional context required to pinpoint the appropriate statutory forum.",
        "clarifying_questions": [
            "Please describe the nature of your dispute or what remedy you seek."
        ]
    }


def validate_text_input(text: Optional[str], field_name: str = "text", max_len: Optional[int] = None) -> str:
    """
    Validates and cleans user text inputs.
    Rejects empty, whitespace-only, excessively long payloads, or pure gibberish.
    """
    if text is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "invalid_input", "message": f"{field_name} cannot be null"}
        )

    cleaned = text.strip()
    if not cleaned:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "invalid_input", "message": f"{field_name} cannot be empty"}
        )

    limit = max_len or settings.MAX_TEXT_LENGTH
    if len(cleaned) > limit:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "invalid_input", "message": f"{field_name} exceeds maximum length of {limit} characters"}
        )

    # Reject blatant keyboard mash or empty gibberish
    if is_gibberish(cleaned):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": "invalid_input",
                "quality_state": DataQualityState.INVALID,
                "message": f"{field_name} contains meaningless or random characters. Please provide an intelligible description."
            }
        )

    return cleaned


def sanitize_filename(filename: str) -> str:
    """Sanitizes filenames to prevent path traversal."""
    clean = os.path.basename(filename)
    return "".join(c for c in clean if c.isalnum() or c in "._- ")
