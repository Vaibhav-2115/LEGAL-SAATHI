"""
Legal Saathi - Session-based Auth & Ownership Verification (SEC-001, SEC-002)
Manages lightweight, privacy-preserving session tokens and verifies ownership.
Prevents Insecure Direct Object References (IDOR) and cross-session data leakage.
"""

import re
from typing import Optional
import uuid
from fastapi import Header, HTTPException, status

# Allowed session ID pattern: alphanumeric, hyphen, underscore, period (1 to 64 chars)
SESSION_ID_PATTERN = re.compile(r"^[a-zA-Z0-9_\-\.]{1,64}$")


def generate_session_id() -> str:
    """Generates a random UUID4 session identifier."""
    return f"sess_{uuid.uuid4().hex[:16]}"


def get_current_session(
    x_session_id: Optional[str] = Header(None, alias="X-Session-ID")
) -> str:
    """
    Extracts and validates the session ID from the X-Session-ID header.
    Rejects malformed headers (e.g. path traversal, control characters, excess length).
    If header is omitted, creates a fresh ephemeral session.
    """
    if not x_session_id or not x_session_id.strip():
        return generate_session_id()
    
    clean_session_id = x_session_id.strip()
    if len(clean_session_id) > 64 or not SESSION_ID_PATTERN.match(clean_session_id):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": "invalid_session_id",
                "message": "Session ID must be alphanumeric and between 1 and 64 characters."
            }
        )
    return clean_session_id


def verify_case_ownership(case_session_id: Optional[str], current_session_id: str) -> bool:
    """
    Verifies that the requester session matches the case owner's session.
    Returns True if ownership matches, False otherwise.
    """
    if not case_session_id:
        return False
    return case_session_id == current_session_id


def enforce_case_ownership(case_session_id: Optional[str], current_session_id: str) -> None:
    """
    Enforces that the current session owns the target case.
    Raises HTTP 403 Forbidden if mismatched, preventing IDOR vulnerabilities.
    """
    if not verify_case_ownership(case_session_id, current_session_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "error": "forbidden",
                "message": "Access denied. You do not have permission to access or modify this case."
            }
        )

