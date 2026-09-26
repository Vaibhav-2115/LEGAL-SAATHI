"""
Legal Saathi - Chat Schemas
Matches the frozen API contract: POST /chat (Part 7 of Roadmap)
Includes Claim-to-Source Citations and Confidence Badges (strong|partial|insufficient).
"""

from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field


class Citation(BaseModel):
    source_id: str
    title: str
    section_ref: str
    excerpt: str
    relevance_score: Optional[float] = None
    jurisdiction: Optional[str] = "India (Central)"
    official_link: Optional[str] = None


class SuggestedAction(BaseModel):
    type: Literal["checklist", "notice", "rti", "dlsa", "efir", "collective", "subscription", "none"] = "none"
    action_id: Optional[str] = None
    title: str
    description: str
    endpoint: Optional[str] = None
    payload: Optional[Dict[str, Any]] = None
    is_premium: bool = False
    cost_inr: Optional[int] = None
    entitlement_feature: Optional[str] = None
    checkout_url: Optional[str] = None


class ChatRequest(BaseModel):
    session_id: Optional[str] = Field(default=None, description="Optional existing session ID")
    case_id: Optional[str] = Field(default=None, description="Optional case ID if continuing an established case")
    text: str = Field(..., description="Citizen's question or problem description in plain language")
    lang: str = Field(default="en", description="hi | en | ta | te | bn | mr | gu | kn")


class ChatResponse(BaseModel):
    answer: str = Field(..., description="Grounded plain-language legal explanation")
    citations: List[Citation] = Field(default_factory=list, description="Verified claim-to-source legal citations")
    confidence: Literal["strong", "partial", "insufficient"] = Field(
        ...,
        description="Confidence badge: strong (well-supported), partial (some evidence), insufficient (unsupported/boundary state)"
    )
    suggested_action: SuggestedAction
    session_id: str
    case_id: Optional[str] = None
    issue_type: str = "general"
    urgency: Literal["low", "medium", "high", "emergency"] = "medium"
    user_tier: Optional[str] = "civic"
    is_entitled: Optional[bool] = True
    disclaimer: str = (
        "Legal Saathi provides legal information and research assistance under Indian law, "
        "not formal legal advice. Please consult an advocate or your local District Legal Services Authority (DLSA) for court representation."
    )
