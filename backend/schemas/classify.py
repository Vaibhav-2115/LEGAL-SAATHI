"""
Legal Saathi - Classify Schemas
Matches POST /classify contract: classifies issue taxonomy, urgency, and emergency status.
"""

from typing import List, Literal, Optional
from pydantic import BaseModel, Field


class ClassifyRequest(BaseModel):
    text: str = Field(..., description="Legal grievance or question text")
    lang: Optional[str] = Field(default="en", description="Language of text")


class ClassifyResponse(BaseModel):
    issue_type: str = Field(..., description="Canonical classification key: property_rera | tenancy | banking_finance | labor | consumer | cyber_fraud | family_domestic | criminal | women_child | civil_contract | education | government_public | welfare_identity | healthcare | legal_aid | general")
    domain: Optional[str] = Field(default=None, description="Human-readable legal domain name among the 15 supported domains")
    secondary_issues: List[str] = Field(default_factory=list, description="Secondary or overlapping legal classifications")
    urgency: Literal["low", "medium", "high", "emergency"] = "medium"
    is_emergency: bool = False
    confidence: float = Field(..., ge=0.0, le=1.0)
    explanation: str
    applicable_acts: List[str] = Field(default_factory=list)
    emergency_helpline: Optional[str] = None

