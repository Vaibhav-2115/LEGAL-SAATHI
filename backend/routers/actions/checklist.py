"""
Legal Saathi - Action Module: Evidence Checklist (checklist.py)
Endpoint POST /actions/checklist: Returns an issue-tailored list of documentary,
digital, and physical evidence needed to substantiate a legal claim.
Per Feature D of the Technical Blueprint.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from backend.core.auth import enforce_case_ownership, get_current_session
from backend.data.db import db
from backend.schemas.actions import ChecklistRequest, ChecklistResponse

router = APIRouter(tags=["Action Modules"])

CHECKLIST_DATA = {
    "consumer": {
        "title": "Consumer Commission Evidence Checklist",
        "essential": [
            {"doc": "Tax Invoice / Purchase Bill", "desc": "Proves consideration paid and identity of seller."},
            {"doc": "Warranty / Guarantee Card", "desc": "Shows contractual defect liability terms and expiry."},
            {"doc": "Service Center Job Sheet / Repair Denial", "desc": "Demonstrates official inspection and persistent defect."}
        ],
        "recommended": [
            {"doc": "Written Email Correspondence", "desc": "Formal customer support ticket numbers and company replies."},
            {"doc": "Unboxing Video / Defect Photos", "desc": "Visual evidence of physical defect or mismatch."},
            {"doc": "Bank / Credit Card Statement", "desc": "Corroborates electronic transaction date and amount."}
        ],
        "tips": [
            "Always retain original physical bills and make at least 3 photocopies.",
            "Under Section 38(2)(c) CPA 2019, laboratory testing can be ordered for mechanical/electronic goods."
        ]
    },
    "property_rera": {
        "title": "RERA Delay & Compensation Evidence Checklist",
        "essential": [
            {"doc": "Allotment Letter & Agreement for Sale (BBA)", "desc": "Contains promised date of possession and penalty clauses."},
            {"doc": "Payment Receipts / Bank Ledger Account", "desc": "Proves timely payment of installments by allottee."},
            {"doc": "RERA Project Registration Certificate", "desc": "Shows promoter's committed completion date on RERA portal."}
        ],
        "recommended": [
            {"doc": "Photographs of Project Site", "desc": "Evidence of incomplete civil construction or stalled work."},
            {"doc": "Demand Letters & Builder Emails", "desc": "Unilateral extension notices or demands for interest."},
            {"doc": "Sanctioned Layout & Brochure", "desc": "Proves deviation from promised amenities or super area."}
        ],
        "tips": [
            "Check your state RERA portal (e.g. MahaRERA, UP RERA, HRERA) for project progress reports.",
            "Under Supreme Court Fortune Infra judgment, you cannot be forced to wait indefinitely."
        ]
    },
    "tenancy": {
        "title": "Tenant Protection & Security Deposit Evidence Checklist",
        "essential": [
            {"doc": "Registered / Notarized Rent Agreement", "desc": "Governs tenure, security deposit amount, and notice period."},
            {"doc": "Bank Transfer Receipts / Rent Receipts", "desc": "Proves rent paid without default."},
            {"doc": "Security Deposit Transfer Proof", "desc": "Initial transaction slip showing deposit handed over."}
        ],
        "recommended": [
            {"doc": "WhatsApp / Email Notice for Vacating", "desc": "Proves mandatory 1-month notice was duly served."},
            {"doc": "Move-out Inspection Photos / Video", "desc": "Demonstrates premises were returned in undamaged condition."},
            {"doc": "Utility Bill Clearance Receipts", "desc": "Proof that electricity and water dues are paid up to date."}
        ],
        "tips": [
            "Landlord cannot cut electricity or water even if dispute arises (Sec 20 Model Tenancy Act).",
            "Take date-stamped video walkthrough before handing over keys."
        ]
    },
    "general": {
        "title": "General Legal Dispute Evidence Checklist",
        "essential": [
            {"doc": "Primary Identity Proof (Aadhaar / Voter ID)", "desc": "Confirms identity of claimant."},
            {"doc": "Core Transactional Contract / Document", "desc": "Written basis of legal relationship."}
        ],
        "recommended": [
            {"doc": "Communication History", "desc": "Written trail of demands and non-compliance."},
            {"doc": "Financial Audit Trail", "desc": "Bank statements or accounts."}
        ],
        "tips": [
            "Documentary evidence takes priority over oral statements in Indian courts."
        ]
    }
}


@router.post("/actions/checklist", response_model=ChecklistResponse)
def get_evidence_checklist(
    payload: ChecklistRequest,
    current_session_id: str = Depends(get_current_session)
):
    """
    Returns an actionable evidence checklist based on grievance issue type.
    Verifies case ownership if case_id is provided.
    """
    if payload.case_id:
        case = db.get_case(payload.case_id)
        if not case:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"error": "case_not_found", "message": f"Case '{payload.case_id}' was not found."}
            )
        enforce_case_ownership(case.session_id, current_session_id)

    issue_type = payload.issue_type.lower()
    data = CHECKLIST_DATA.get(issue_type, CHECKLIST_DATA["general"])

    return ChecklistResponse(
        issue_type=issue_type,
        title=data["title"],
        essential_documents=data["essential"],
        recommended_evidence=data["recommended"],
        verification_tips=data["tips"]
    )

