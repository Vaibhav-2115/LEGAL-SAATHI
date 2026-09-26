"""
Legal Saathi - Input Validation (SEC-003)
Enforces payload limits, trims whitespace, and cleans input fields.
"""

from typing import Optional
from fastapi import HTTPException, status
from backend.core.config import settings


def validate_text_input(text: Optional[str], field_name: str = "text", max_len: Optional[int] = None) -> str:
    """
    Validates and cleans user text inputs.
    Rejects empty, whitespace-only, or excessively long payloads.
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
    
    return cleaned


def sanitize_filename(filename: str) -> str:
    """
    Sanitizes filenames to prevent path traversal.
    """
    import os
    clean = os.path.basename(filename)
    return "".join(c for c in clean if c.isalnum() or c in "._- ")
