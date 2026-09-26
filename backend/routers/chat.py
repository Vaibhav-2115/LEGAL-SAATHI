"""
Legal Saathi - Chat Router (chat.py)
Core endpoint POST /chat: Processes citizen query through the verified grounded pipeline.
Per Part 7 of the Roadmap.
"""

from fastapi import APIRouter, Depends, HTTPException, Request, status
from backend.core.auth import get_current_session
from backend.core.logging import logger
from backend.data.db import db
from backend.safety.input_validation import validate_text_input
from backend.safety.prompt_injection_guard import check_prompt_injection
from backend.safety.rate_limiter import rate_limit_dependency
from backend.schemas.chat import ChatRequest, ChatResponse
from backend.services.pipeline import pipeline

router = APIRouter(tags=["Chat"])


@router.post("/chat", response_model=ChatResponse, dependencies=[Depends(rate_limit_dependency)])
async def chat_endpoint(
    payload: ChatRequest,
    current_session_id: str = Depends(get_current_session)
):
    """
    Submits a user query in plain language (Hindi, English, etc.) and returns
    a legally grounded explanation, verified citations, confidence badge, and suggested action.
    """
    # 1. Input Validation
    clean_text = validate_text_input(payload.text, field_name="text")

    # 2. Prompt Injection Guard (SEC-006)
    is_injected, injection_msg = check_prompt_injection(clean_text)
    if is_injected:
        logger.warning(f"Rejected prompt injection attempt from session {current_session_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "invalid_input", "message": injection_msg}
        )

    # 3. Session Resolution & Validation
    active_session_id = current_session_id
    if payload.session_id:
        from backend.core.auth import SESSION_ID_PATTERN, enforce_case_ownership
        if len(payload.session_id) > 64 or not SESSION_ID_PATTERN.match(payload.session_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"error": "invalid_session_id", "message": "Invalid session_id format."}
            )
        active_session_id = payload.session_id
    else:
        from backend.core.auth import enforce_case_ownership

    db.get_or_create_session(active_session_id, lang=payload.lang)

    # 4. Case Ownership Verification (if case_id provided)
    if payload.case_id:
        case = db.get_case(payload.case_id)
        if not case:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"error": "case_not_found", "message": f"Case '{payload.case_id}' was not found."}
            )
        enforce_case_ownership(case.session_id, active_session_id)

    # 5. Pipeline Execution
    try:
        response = await pipeline.process_chat(
            text=clean_text,
            session_id=active_session_id,
            case_id=payload.case_id,
            lang=payload.lang
        )
        return response
    except Exception as e:
        logger.error(f"Error in /chat pipeline: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "pipeline_error", "message": "Failed to process legal query. Please retry."}
        )
