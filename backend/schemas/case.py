"""
Legal Saathi - Case Schemas
Defines structured Case, Entity, and Evidence Pydantic models.
Matches docs/CASE_SCHEMA.md and Section 8/13 of the project blueprint.
"""

from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
import uuid
from pydantic import BaseModel, Field


class CaseEntities(BaseModel):
    opposing_party: Optional[str] = Field(default=None, max_length=150, description="Name of opposing party, landlord, merchant, or builder")
    opposing_party_hash: Optional[str] = Field(default=None, max_length=64, description="SHA-256 hash for privacy-safe cross-matching")
    location: Optional[str] = Field(default=None, max_length=150, description="Specific location or city")
    locality_bucket: Optional[str] = Field(default=None, max_length=100, description="Coarse district/state bucket for cross-user clustering")
    amount: Optional[float] = Field(default=None, ge=0.0, le=1_000_000_000.0, description="Monetary claim or disputed amount in INR")
    amount_bucket: Optional[str] = Field(default=None, max_length=50, description="Bucketed range (e.g. ₹25k-1L) for privacy")
    dates: List[str] = Field(default_factory=list, max_length=20, description="Extracted dates or timeframe")
    key_facts: List[str] = Field(default_factory=list, max_length=30, description="Bullet points of verified factual claims")
    grievance: Optional[str] = Field(default=None, max_length=5000, description="Primary grievance description")


class EvidenceItem(BaseModel):
    evidence_id: str = Field(default_factory=lambda: f"evi_{uuid.uuid4().hex[:10]}", max_length=64)
    type: str = Field(default="document", max_length=50, description="document | photo | message | receipt | bank_statement | email | other")
    description: str = Field(..., min_length=1, max_length=500)
    status: str = Field(default="needed", max_length=30, description="needed | collected | verified")
    source_filename: Optional[str] = Field(default=None, max_length=255)
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class CaseCreate(BaseModel):
    session_id: Optional[str] = Field(default=None, max_length=64)
    issue_type: str = Field(default="general", max_length=50, description="tenancy | consumer | property_rera | rti | labor | family_domestic | cyber_fraud | general")
    title: Optional[str] = Field(default=None, max_length=200)
    description: Optional[str] = Field(default=None, max_length=5000)
    entities: Optional[CaseEntities] = Field(default_factory=CaseEntities)
    consent_status: str = Field(default="pending", max_length=30, description="pending | granted | revoked")


class CaseUpdate(BaseModel):
    issue_type: Optional[str] = Field(default=None, max_length=50)
    title: Optional[str] = Field(default=None, max_length=200)
    description: Optional[str] = Field(default=None, max_length=5000)
    entities: Optional[CaseEntities] = None
    evidence: Optional[List[EvidenceItem]] = None
    consent_status: Optional[str] = Field(default=None, max_length=30)



class CaseResponse(BaseModel):
    case_id: str
    session_id: str
    issue_type: str
    title: str
    description: str
    entities: CaseEntities
    evidence: List[EvidenceItem] = Field(default_factory=list)
    consent_status: str
    created_at: str
    updated_at: str
