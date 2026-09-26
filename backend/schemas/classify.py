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
    issue_type: str = Field(..., description="tenancy | consumer | property_rera | rti | labor | family_domestic | cyber_fraud | general")
    urgency: Literal["low", "medium", "high", "emergency"] = "medium"
    is_emergency: bool = False
    confidence: float = Field(..., ge=0.0, le=1.0)
    explanation: str
    applicable_acts: List[str] = Field(default_factory=list)
    emergency_helpline: Optional[str] = None
