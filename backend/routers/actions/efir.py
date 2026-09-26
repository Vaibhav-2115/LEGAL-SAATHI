"""
Legal Saathi - Action Module: e-FIR & Police Guidance (efir.py)
Endpoint POST /actions/efir: Guides citizens on filing e-FIR, NCR, or cyber complaints.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from backend.core.auth import enforce_case_ownership, get_current_session
from backend.data.db import db
from backend.schemas.actions import EFIRRequest, EFIRResponse

router = APIRouter(tags=["Action Modules"])


@router.post("/actions/efir", response_model=EFIRResponse)
def get_efir_guidance(
    payload: EFIRRequest,
    current_session_id: str = Depends(get_current_session)
):
    """
    Evaluates grievance and gives step-by-step guidance for e-FIR or cyber reporting.
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

    is_cyber = "cyber" in payload.incident_type.lower() or "fraud" in payload.incident_type.lower() or "upi" in payload.incident_type.lower()
    
    if is_cyber:
        offense_cat = "Cyber Financial Fraud (Immediate Account Freeze Required)"
        steps = [
            "1. DIAL 1930 IMMEDIATELY: Connect with the Citizen Financial Cyber Fraud Reporting System to freeze receiver bank/UPI accounts.",
            "2. Note down the Acknowledgement Number given by the 1930 operator.",
            "3. Register an official complaint on https://cybercrime.gov.in within 24 hours.",
            "4. Upload bank statement showing transaction ID (UTR/RRN number) and screenshot of scam message.",
            "5. Submit copy of cyber report to your home bank branch requesting lien/reversal."
        ]
        checklist = [
            "Bank statement highlighting fraudulent deduction with UTR / Reference number.",
            "Screenshots of SMS / WhatsApp / Telegram scam chats.",
            "Caller phone number, UPI ID, or URL link used by fraudster.",
            "Device IMEI number or IP address if available."
        ]
    else:
        offense_cat = "Cognizable Offense / Non-Cognizable Report (NCR)"
        steps = [
            "1. Check if your state police portal offers e-FIR (most states allow e-FIR for theft, vehicle theft, missing items).",
            "2. For heinous or in-person crimes (assault, physical trespass, threat), visit the nearest Police Station in person.",
            "3. If police refuse to register FIR under Section 154 CrPC / 173 BNSS, submit written complaint to Superintendent of Police (SP/DCP) under Section 154(3).",
            "4. Always demand a free certified copy of the registered First Information Report (FIR)."
        ]
        checklist = [
            "Written complaint signed with exact date, time, and sequence of events.",
            "Name, description, and contact info of opposing accused party.",
            "Names and phone numbers of independent eyewitnesses if present.",
            "CCTV footage, photographic proof, or medical injury report (MLC)."
        ]

    return EFIRResponse(
        eligible_for_efir=is_cyber or "theft" in payload.incident_type.lower(),
        offense_category=offense_cat,
        national_cyber_portal="https://cybercrime.gov.in (Toll-Free: 1930)",
        nearest_station_guidance="Jurisdiction police station where incident occurred, or 'Zero FIR' at any police station across India.",
        step_by_step_instructions=steps,
        mandatory_checklist=checklist
    )
