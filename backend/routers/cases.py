"""
Legal Saathi - Cases Router (cases.py)
Endpoints: POST /cases, GET /cases, GET /cases/{id}, PATCH /cases/{id}
Manages structured Case objects, entity extraction, and evidence tracking.
Per Part 7 of the Roadmap.
"""

from typing import List, Optional
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from backend.core.auth import enforce_case_ownership, get_current_session
from backend.data.db import db
from backend.schemas.case import CaseCreate, CaseResponse, CaseUpdate, EvidenceItem
from backend.services.engine.normalization import normalize_entities

router = APIRouter(tags=["Cases"])


@router.post("/cases", response_model=CaseResponse)
def create_case(
    payload: CaseCreate,
    current_session_id: str = Depends(get_current_session)
):
    """Creates a new structured Case object bounded to the authenticated session."""
    active_session_id = current_session_id
    case_id = f"case_{uuid.uuid4().hex[:10]}"
    
    # Normalize entities if provided
    entities = payload.entities
    if entities:
        entities = normalize_entities(entities)

    default_evidence = [
        EvidenceItem(type="document", description="Written contract, invoice, or agreement", status="needed"),
        EvidenceItem(type="receipt", description="Proof of payment or bank transaction", status="needed"),
        EvidenceItem(type="message", description="Written communication / chat / email record", status="needed")
    ]

    saved_case = db.save_case(
        case_id=case_id,
        session_id=active_session_id,
        issue_type=payload.issue_type,
        title=payload.title or f"{payload.issue_type.title()} Case",
        description=payload.description or "",
        entities=entities,
        evidence=default_evidence,
        consent_status=payload.consent_status
    )
    return saved_case


@router.get("/cases", response_model=List[CaseResponse])
def list_cases(current_session_id: str = Depends(get_current_session)):
    """Lists cases belonging strictly to the active session."""
    return db.list_cases(session_id=current_session_id)


@router.get("/cases/{case_id}", response_model=CaseResponse)
def get_case_by_id(
    case_id: str,
    current_session_id: str = Depends(get_current_session)
):
    """Fetches a single Case by ID with authorization verification (SEC-002)."""
    case = db.get_case(case_id)
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": "case_not_found", "message": f"Case '{case_id}' was not found."}
        )
    enforce_case_ownership(case.session_id, current_session_id)
    return case


@router.patch("/cases/{case_id}", response_model=CaseResponse)
def update_case(
    case_id: str,
    payload: CaseUpdate,
    current_session_id: str = Depends(get_current_session)
):
    """Partially updates a Case with strict ownership verification."""
    existing_case = db.get_case(case_id)
    if not existing_case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": "case_not_found", "message": f"Case '{case_id}' was not found."}
        )
    enforce_case_ownership(existing_case.session_id, current_session_id)

    # Merge updates
    updated_issue_type = payload.issue_type or existing_case.issue_type
    updated_title = payload.title or existing_case.title
    updated_description = payload.description or existing_case.description
    updated_entities = payload.entities or existing_case.entities
    updated_evidence = payload.evidence if payload.evidence is not None else existing_case.evidence
    updated_consent = payload.consent_status or existing_case.consent_status

    if payload.entities:
        updated_entities = normalize_entities(updated_entities)

    saved = db.save_case(
        case_id=case_id,
        session_id=existing_case.session_id,
        issue_type=updated_issue_type,
        title=updated_title,
        description=updated_description,
        entities=updated_entities,
        evidence=updated_evidence,
        consent_status=updated_consent
    )
    return saved


@router.delete("/cases/{case_id}", status_code=status.HTTP_200_OK)
def delete_case(
    case_id: str,
    current_session_id: str = Depends(get_current_session)
):
    """Deletes a Case with strict ownership verification."""
    existing_case = db.get_case(case_id)
    if not existing_case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": "case_not_found", "message": f"Case '{case_id}' was not found."}
        )
    enforce_case_ownership(existing_case.session_id, current_session_id)
    db.delete_case(case_id=case_id, session_id=current_session_id)
    return {"status": "success", "message": f"Case '{case_id}' has been permanently deleted."}

