"""
Legal Saathi - Action Module: RTI Application (rti.py)
Endpoint POST /actions/rti: Formats formal Section 6(1) RTI Application
under the Right to Information Act, 2005.
"""

from datetime import datetime, timezone
import uuid
from fastapi import APIRouter
from backend.data.db import db
from backend.schemas.actions import RTIRequest, RTIResponse

router = APIRouter(tags=["Action Modules"])


@router.post("/actions/rti", response_model=RTIResponse)
def draft_rti_application(payload: RTIRequest):
    """
    Generates an official RTI application under Section 6(1) of the RTI Act, 2005.
    """
    draft_id = f"draft_rti_{uuid.uuid4().hex[:10]}"
    now_utc = datetime.now(timezone.utc)
    date_str = now_utc.strftime("%d-%m-%Y")

    questions_formatted = "\n".join([
        f"    ({i+1}) {q}" for i, q in enumerate(payload.queries)
    ]) if payload.queries else (
        "    (1) Provide certified copies of all file notings, orders, and correspondence regarding the subject matter.\n"
        "    (2) State the official timeline prescribed for resolution and reasons for current delay."
    )

    fee_details = "Exempt from Application Fee (BPL Cardholder under Proviso to Section 7(5))" if payload.is_bpl else "Rs. 10/- (Indian Postal Order / Court Fee Stamp / Online RTIPortal)"
    timeline = "48 Hours (Pertaining to Life and Liberty under Proviso to Sec 7(1))" if payload.is_life_liberty else "30 Calendar Days (Standard statutory disposal under Section 7(1))"

    application_text = f"""FORM 'A'
APPLICATION FOR SEEKING INFORMATION UNDER THE RIGHT TO INFORMATION ACT, 2005
[Section 6(1) of the RTI Act, 2005]

Date: {date_str}

TO,
The Central / State Public Information Officer (CPIO / SPIO),
Office of: {payload.public_authority_name}
Department: {payload.department}
Jurisdiction: {payload.state_or_central} Government

1. FULL NAME OF APPLICANT: {payload.applicant_name}
2. ADDRESS FOR CORRESPONDENCE: {payload.applicant_address}
3. CITIZENSHIP: Citizen of India

4. PARTICULARS OF INFORMATION REQUIRED:
{questions_formatted}

5. TIMEFRAME FOR SUPPLYING INFORMATION:
    {timeline}

6. APPLICATION FEE PARTICULARS:
    {fee_details}

7. STATUTORY DECLARATION:
    I hereby declare that I am a citizen of India and the information sought does not fall within the exemptions specified under Section 8 or 9 of the RTI Act, 2005.

Place: {payload.applicant_address.split(',')[-1].strip() or 'India'}
Date: {date_str}

_____________________________
Signature / Thumb Impression of Applicant
({payload.applicant_name})
"""

    db.save_draft(
        draft_id=draft_id,
        case_id=payload.case_id,
        action_type="rti",
        title=f"RTI Application - {payload.public_authority_name}",
        content=application_text,
        metadata={"life_liberty": payload.is_life_liberty, "bpl": payload.is_bpl}
    )

    portal = "https://rtionline.gov.in" if payload.state_or_central == "Central" else "Respective State RTI Online Portal or Physical Speed Post"

    return RTIResponse(
        draft_id=draft_id,
        application_text=application_text,
        public_authority=payload.public_authority_name,
        fee_amount="Rs. 0 (Exempt)" if payload.is_bpl else "Rs. 10/-",
        payment_mode="Online via Debit Card/UPI on RTI Online, or IPO / Demand Draft by Post",
        timeline=timeline,
        appeal_officer_info="First Appellate Authority (FAA) within 30 days if unanswered.",
        submission_portal=portal,
        created_at=datetime.now(timezone.utc).isoformat()
    )
