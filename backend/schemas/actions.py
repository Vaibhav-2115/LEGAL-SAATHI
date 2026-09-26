"""
Legal Saathi - Action Module Schemas
Defines schemas for Notice, RTI, DLSA, e-FIR, and Evidence Checklist modules.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class NoticeRequest(BaseModel):
    case_id: Optional[str] = Field(None, max_length=64, description="Optional associated case ID")
    sender_name: str = Field(..., min_length=1, max_length=150)
    sender_address: str = Field(..., min_length=1, max_length=300)
    recipient_name: str = Field(..., min_length=1, max_length=150)
    recipient_address: str = Field(..., min_length=1, max_length=300)
    subject: str = Field(..., min_length=1, max_length=250)
    issue_type: str = Field(default="consumer", max_length=50)
    facts: List[str] = Field(default_factory=list, max_length=30)
    demands: List[str] = Field(default_factory=list, max_length=15)
    statutory_notice_days: int = Field(default=15, ge=1, le=180, description="Usually 15 or 30 days under Indian law")
    disputed_amount: Optional[float] = Field(None, ge=0.0, le=1_000_000_000.0)


class NoticeResponse(BaseModel):
    draft_id: str
    case_id: Optional[str] = None
    notice_title: str
    draft_text: str
    applicable_act: str
    statutory_warning: str
    filing_instructions: List[str]
    created_at: str
    is_unlocked: bool = True
    watermarked: bool = False
    price_inr: Optional[int] = 199
    checkout_url: Optional[str] = None


class RTIRequest(BaseModel):
    case_id: Optional[str] = Field(None, max_length=64)
    applicant_name: str = Field(..., min_length=1, max_length=150)
    applicant_address: str = Field(..., min_length=1, max_length=300)
    public_authority_name: str = Field(..., min_length=1, max_length=200)
    department: str = Field(..., min_length=1, max_length=150)
    state_or_central: str = Field(default="Central", max_length=50)
    queries: List[str] = Field(default_factory=list, max_length=30, description="Numbered information requests under Sec 6(1)")
    is_life_liberty: bool = Field(default=False, description="Whether inquiry involves life or liberty (48 hour timeline)")
    is_bpl: bool = Field(default=False, description="Below Poverty Line cardholder (fee exempt)")


class RTIResponse(BaseModel):
    draft_id: str
    application_text: str
    public_authority: str
    fee_amount: str
    payment_mode: str
    timeline: str
    appeal_officer_info: str
    submission_portal: str
    created_at: str
    is_unlocked: bool = True
    price_inr: Optional[int] = 199
    checkout_url: Optional[str] = None


class DLSAGuidanceResponse(BaseModel):
    district: str
    state: str
    dlsa_office_name: str
    address: str
    helpline_number: str
    national_legal_aid_tollfree: str = "15100"
    eligibility_criteria: List[str]
    services_offered: List[str]
    application_process: List[str]


class EFIRRequest(BaseModel):
    case_id: Optional[str] = Field(None, max_length=64)
    incident_type: str = Field(..., min_length=1, max_length=100)
    incident_date: Optional[str] = Field(None, max_length=50)
    incident_location: Optional[str] = Field(None, max_length=200)
    details: str = Field(..., min_length=1, max_length=5000)
    evidence_types: List[str] = Field(default_factory=list, max_length=30)


class EFIRResponse(BaseModel):
    eligible_for_efir: bool
    offense_category: str  # Cognizable | Non-Cognizable (NCR) | Cyber Financial Fraud
    national_cyber_portal: str = "https://cybercrime.gov.in (Toll-Free: 1930)"
    nearest_station_guidance: str
    step_by_step_instructions: List[str]
    mandatory_checklist: List[str]
    is_unlocked: bool = True
    price_inr: Optional[int] = 199
    checkout_url: Optional[str] = None


class ChecklistRequest(BaseModel):
    issue_type: str = Field(default="consumer", max_length=50)
    case_id: Optional[str] = Field(None, max_length=64)



class ChecklistResponse(BaseModel):
    issue_type: str
    title: str
    essential_documents: List[Dict[str, str]]
    recommended_evidence: List[Dict[str, str]]
    verification_tips: List[str]
