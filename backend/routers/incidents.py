"""
Legal Saathi - Incidents Router (incidents.py)
Endpoints: POST /incidents, GET /incidents/{id}/similar
Powers the Legal Saathi Engine pattern detection and collective action discovery.
Per Section 8 & Part 7 of the Roadmap.
"""

import uuid
from fastapi import APIRouter, HTTPException, status
from backend.data.db import db
from backend.schemas.incidents import IncidentCreate, IncidentResponse, SimilarIncidentItem, SimilarIncidentResponse
from backend.services.engine.clustering import engine

router = APIRouter(tags=["Incidents / Legal Saathi Engine"])


@router.post("/incidents", response_model=IncidentResponse)
def submit_incident(payload: IncidentCreate):
    """
    Submits a case into the anonymized Incident corpus for cross-user pattern detection.
    Requires informed Stage 1 consent.
    """
    case = db.get_case(payload.case_id)
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": "case_not_found", "message": f"Case '{payload.case_id}' was not found."}
        )

    incident_id = f"inc_{uuid.uuid4().hex[:10]}"
    entities = case.entities

    saved_incident = db.save_incident(
        incident_id=incident_id,
        case_id=payload.case_id,
        issue_type=case.issue_type,
        locality_bucket=entities.locality_bucket or "General Region",
        amount_bucket=entities.amount_bucket or "Not Specified",
        opposing_party_hash=entities.opposing_party_hash or "hash_unspecified",
        consent_stage1=payload.consent_flag
    )

    return IncidentResponse(
        incident_id=saved_incident["incident_id"],
        case_id=saved_incident["case_id"],
        cluster_id=saved_incident.get("cluster_id"),
        issue_type=saved_incident["issue_type"],
        locality_bucket=saved_incident["locality_bucket"],
        amount_bucket=saved_incident["amount_bucket"],
        opposing_party_hash=saved_incident["opposing_party_hash"],
        consent_stage1=saved_incident["consent_stage1"],
        consent_stage2=False,
        created_at=saved_incident["created_at"]
    )


@router.get("/incidents/{incident_id}/similar", response_model=SimilarIncidentResponse)
def get_similar_incidents(incident_id: str):
    """
    Finds and explains similar incidents matching the target incident.
    Always provides transparent human-readable explanation of matching factors.
    """
    incident = db.get_incident(incident_id)
    if not incident:
        # Check if caller passed a case_id instead
        incident = db.get_incident_by_case(incident_id)

    if not incident:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": "incident_not_found", "message": f"Incident '{incident_id}' not found."}
        )

    similar_matches = engine.find_similar_incidents(incident, threshold=0.55)
    
    similar_items = [
        SimilarIncidentItem(
            incident_id=m["incident_id"],
            similarity_score=m["similarity_score"],
            explanation=m["explanation"],
            matched_fields=m["matched_fields"],
            locality_bucket=m["locality_bucket"],
            issue_type=m["issue_type"],
            amount_bucket=m["amount_bucket"]
        )
        for m in similar_matches
    ]

    has_cluster = len(similar_items) >= 2
    explanation = (
        f"Found {len(similar_items)} other citizens in your region with similar grievances."
        if similar_items else
        "No matching incidents found yet in your locality bucket. As more citizens report, patterns will emerge."
    )

    return SimilarIncidentResponse(
        incident_id=incident["incident_id"],
        similar=similar_items,
        has_cluster=has_cluster,
        cluster_id=incident.get("cluster_id"),
        collective_action_eligible=has_cluster,
        explanation=explanation
    )
