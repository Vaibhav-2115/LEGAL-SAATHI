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
    opposing_party: Optional[str] = Field(default=None, description="Name of opposing party, landlord, merchant, or builder")
    opposing_party_hash: Optional[str] = Field(default=None, description="SHA-256 hash for privacy-safe cross-matching")
    location: Optional[str] = Field(default=None, description="Specific location or city")
    locality_bucket: Optional[str] = Field(default=None, description="Coarse district/state bucket for cross-user clustering")
    amount: Optional[float] = Field(default=None, description="Monetary claim or disputed amount in INR")
    amount_bucket: Optional[str] = Field(default=None, description="Bucketed range (e.g. ₹25k-1L) for privacy")
    dates: List[str] = Field(default_factory=list, description="Extracted dates or timeframe")
    key_facts: List[str] = Field(default_factory=list, description="Bullet points of verified factual claims")
    grievance: Optional[str] = Field(default=None, description="Primary grievance description")


class EvidenceItem(BaseModel):
    evidence_id: str = Field(default_factory=lambda: f"evi_{uuid.uuid4().hex[:10]}")
    type: str = Field(default="document", description="document | photo | message | receipt | bank_statement | email | other")
    description: str
    status: str = Field(default="needed", description="needed | collected | verified")
    source_filename: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class CaseCreate(BaseModel):
    session_id: Optional[str] = None
    issue_type: str = Field(default="general", description="tenancy | consumer | property_rera | rti | labor | family_domestic | cyber_fraud | general")
    title: Optional[str] = None
    description: Optional[str] = None
    entities: Optional[CaseEntities] = Field(default_factory=CaseEntities)
    consent_status: str = Field(default="pending", description="pending | granted | revoked")


class CaseUpdate(BaseModel):
    issue_type: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    entities: Optional[CaseEntities] = None
    evidence: Optional[List[EvidenceItem]] = None
    consent_status: Optional[str] = None


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
