"""
Legal Saathi - Incident & Legal Saathi Engine Schemas
Defines schemas for cross-case similarity, pattern detection, and consent-gated collective action.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class IncidentCreate(BaseModel):
    case_id: str = Field(..., description="ID of the source case")
    consent_flag: bool = Field(default=False, description="Stage-1 consent to include in pattern detection")


class IncidentResponse(BaseModel):
    incident_id: str
    case_id: str
    cluster_id: Optional[str] = None
    issue_type: str
    locality_bucket: str
    amount_bucket: str
    opposing_party_hash: str
    consent_stage1: bool
    consent_stage2: bool = False
    created_at: str


class SimilarIncidentItem(BaseModel):
    incident_id: str
    similarity_score: float = Field(..., ge=0.0, le=1.0)
    explanation: str
    matched_fields: List[str]
    locality_bucket: str
    issue_type: str
    amount_bucket: str


class SimilarIncidentResponse(BaseModel):
    incident_id: str
    similar: List[SimilarIncidentItem]
    has_cluster: bool = False
    cluster_id: Optional[str] = None
    collective_action_eligible: bool = False
    explanation: str
