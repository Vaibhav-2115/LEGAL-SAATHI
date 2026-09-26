"""
Legal Saathi - Session-based Auth & Ownership Verification (SEC-001, SEC-002)
Manages lightweight, privacy-preserving session tokens and verifies ownership.
"""

from typing import Optional
import uuid
from fastapi import Header, HTTPException, status


def generate_session_id() -> str:
    """Generates a random UUID4 session identifier."""
    return f"sess_{uuid.uuid4().hex[:16]}"


def get_current_session(
    x_session_id: Optional[str] = Header(None, alias="X-Session-ID")
) -> str:
    """
    Extracts the session ID from the X-Session-ID header or returns a default session.
    Allows easy consumer interaction while keeping own-case boundaries safe.
    """
    if not x_session_id or not x_session_id.strip():
        # Generate an ephemeral session if header is omitted
        return generate_session_id()
    
    clean_session_id = x_session_id.strip()
    if len(clean_session_id) > 64:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "invalid_session_id", "message": "Session ID length exceeds limit"}
        )
    return clean_session_id


def verify_case_ownership(case_session_id: Optional[str], current_session_id: str) -> bool:
    """
    Verifies that the requester session matches the case owner's session.
    """
    if not case_session_id:
        return True
    return case_session_id == current_session_id
