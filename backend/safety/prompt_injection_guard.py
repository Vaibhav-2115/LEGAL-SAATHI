"""
Legal Saathi - Prompt Injection Guard (SEC-006)
Detects and neutralizes prompt injection, jailbreaks, and system override attempts.
"""

import re
from typing import Tuple

INJECTION_PATTERNS = [
    re.compile(r"ignore\s+(all\s+)?(previous|prior|above)\s+instructions?", re.IGNORECASE),
    re.compile(r"disregard\s+(all\s+)?(previous|prior|above)\s+instructions?", re.IGNORECASE),
    re.compile(r"you\s+are\s+now\s+(an?\s+)?unrestricted", re.IGNORECASE),
    re.compile(r"jailbreak", re.IGNORECASE),
    re.compile(r"dan\s+mode", re.IGNORECASE),
    re.compile(r"system\s*prompt\s*reveal", re.IGNORECASE),
    re.compile(r"output\s+initial\s+prompt", re.IGNORECASE),
    re.compile(r"acting\s+as\s+a\s+hacker", re.IGNORECASE),
    re.compile(r"simulate\s+an?\s+evil", re.IGNORECASE),
    re.compile(r"<\|im_start\|>", re.IGNORECASE),
    re.compile(r"<\|im_end\|>", re.IGNORECASE),
    re.compile(r"\[INST\]", re.IGNORECASE),
]


def check_prompt_injection(text: str) -> Tuple[bool, str]:
    """
    Scans the text for common prompt injection and role confusion signatures.
    Returns (is_injected, sanitized_or_flagged_text).
    """
    for pattern in INJECTION_PATTERNS:
        if pattern.search(text):
            # Injection attempt detected
            return True, "Suspicious prompt injection or override attempt detected."
    return False, text


def sanitize_for_prompt(text: str) -> str:
    """
    Wraps text with boundary delimiters and removes control tokens so that
    user inputs cannot break out of their variable enclosure in LLM prompts.
    """
    sanitized = text.replace("```", "'''")
    sanitized = sanitized.replace("<|", "< |").replace("|>", "| >")
    return sanitized
