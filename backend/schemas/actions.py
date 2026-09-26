"""
Legal Saathi - Action Module Schemas
Defines schemas for Notice, RTI, DLSA, e-FIR, and Evidence Checklist modules.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class NoticeRequest(BaseModel):
    case_id: Optional[str] = None
    sender_name: str
    sender_address: str
    recipient_name: str
    recipient_address: str
    subject: str
    issue_type: str = "consumer"
    facts: List[str] = Field(default_factory=list)
    demands: List[str] = Field(default_factory=list)
    statutory_notice_days: int = Field(default=15, description="Usually 15 or 30 days under Indian law")
    disputed_amount: Optional[float] = None


class NoticeResponse(BaseModel):
    draft_id: str
    case_id: Optional[str] = None
    notice_title: str
    draft_text: str
    applicable_act: str
    statutory_warning: str
    filing_instructions: List[str]
    created_at: str


class RTIRequest(BaseModel):
    case_id: Optional[str] = None
    applicant_name: str
    applicant_address: str
    public_authority_name: str
    department: str
    state_or_central: str = "Central"
    queries: List[str] = Field(default_factory=list, description="Numbered information requests under Sec 6(1)")
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
    case_id: Optional[str] = None
    incident_type: str
    incident_date: Optional[str] = None
    incident_location: Optional[str] = None
    details: str
    evidence_types: List[str] = Field(default_factory=list)


class EFIRResponse(BaseModel):
    eligible_for_efir: bool
    offense_category: str  # Cognizable | Non-Cognizable (NCR) | Cyber Financial Fraud
    national_cyber_portal: str = "https://cybercrime.gov.in (Toll-Free: 1930)"
    nearest_station_guidance: str
    step_by_step_instructions: List[str]
    mandatory_checklist: List[str]


class ChecklistRequest(BaseModel):
    issue_type: str = "consumer"
    case_id: Optional[str] = None


class ChecklistResponse(BaseModel):
    issue_type: str
    title: str
    essential_documents: List[Dict[str, str]]
    recommended_evidence: List[Dict[str, str]]
    verification_tips: List[str]
