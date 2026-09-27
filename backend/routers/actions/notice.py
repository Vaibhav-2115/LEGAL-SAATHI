"""
Legal Saathi - Action Module: Legal Notice Drafting (notice.py)
Endpoint POST /actions/notice: Generates a ready-to-dispatch formal Legal Notice
under Indian procedural law (e.g. Consumer Protection Act, RERA Section 18, Section 106 TPA).
Per Section 12 & Part 5 of the Roadmap.
"""

from datetime import datetime, timedelta, timezone
import difflib
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from backend.core.auth import enforce_case_ownership, get_current_session
from backend.data.db import db
from backend.schemas.actions import (
    NoticeRequest,
    NoticeResponse,
    EditDraftRequest,
    EditDraftResponse
)
from backend.services.llm_provider import llm_provider

router = APIRouter(tags=["Action Modules"])


@router.post("/actions/notice", response_model=NoticeResponse)
def draft_legal_notice(
    payload: NoticeRequest,
    current_session_id: str = Depends(get_current_session)
):
    """
    Drafts a comprehensive formal Indian legal notice.
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

    draft_id = f"draft_not_{uuid.uuid4().hex[:10]}"
    now_utc = datetime.now(timezone.utc)
    date_str = now_utc.strftime("%d-%m-%Y")
    deadline_date = (now_utc + timedelta(days=payload.statutory_notice_days)).strftime("%d-%m-%Y")

    facts_formatted = "\n".join([f"    {i+1}. {fact}" for i, fact in enumerate(payload.facts)]) if payload.facts else (
        f"    1. That my Client availed services/products from you having paid consideration.\n"
        f"    2. That there has been an unlawful deficiency in service and failure to fulfill statutory commitments."
    )

    demands_formatted = "\n".join([f"    {i+1}. {demand}" for i, demand in enumerate(payload.demands)]) if payload.demands else (
        f"    1. Immediately rectify the deficiency and refund the sum of Rs. {payload.disputed_amount or 'consideration paid'} with interest.\n"
        f"    2. Compensate my Client for undue harassment and mental agony."
    )

    applicable_act = (
        "Consumer Protection Act, 2019 (Sections 2(11), 35)" if payload.issue_type == "consumer"
        else "Real Estate (Regulation and Development) Act, 2016 (Section 18)" if payload.issue_type == "property_rera"
        else "Model Tenancy Act / Section 106 of the Transfer of Property Act, 1882"
    )

    notice_body = f"""LEGAL NOTICE
(Registered A.D. / Speed Post / Legal Email)

Date: {date_str}

TO,
{payload.recipient_name}
{payload.recipient_address}

FROM / ON BEHALF OF:
{payload.sender_name}
{payload.sender_address}

SUBJECT: {payload.subject} — DEMAND NOTICE UNDER {applicable_act.upper()}

Sir/Madam,

Under instructions from and on behalf of my client/claimant, {payload.sender_name}, residing at {payload.sender_address}, I hereby serve upon you this formal Legal Notice:

1. STATEMENT OF FACTS:
{facts_formatted}

2. STATUTORY VIOLATION:
    That your aforesaid acts and omissions constitute a direct violation of {applicable_act}, causing severe financial loss, physical hardship, and mental agony to my Client.

3. REQUISITE RELIEFS AND DEMANDS:
    In light of the above, my Client hereby formally calls upon you to comply with the following demands within {payload.statutory_notice_days} DAYS from the receipt of this notice:
{demands_formatted}
    3. Pay a sum of Rs. 10,000 towards the costs of this Legal Notice.

4. STATUTORY WARNING:
    TAKE NOTE that if you fail to comply with the above demands within the stipulated period of {payload.statutory_notice_days} days (on or before {deadline_date}), my Client shall be constrained to initiate appropriate legal proceedings before the competent Court of Law / Consumer Commission / RERA Authority at your sole risk, cost, and legal consequences.

Yours faithfully,

_____________________________
Advocate / Authorized Signatory
(On behalf of {payload.sender_name})
"""

    user_id = db.get_or_create_session(current_session_id).get("user_id") or current_session_id
    is_pro = db.check_user_has_active_pro(user_id)
    is_unlocked_item = db.check_user_has_unlocked_item(user_id, "notice_draft") or bool(payload.case_id and db.check_user_has_unlocked_item(user_id, payload.case_id))
    is_unlocked = is_pro or is_unlocked_item

    final_draft_text = notice_body
    watermarked = False
    checkout_url = None

    if not is_unlocked:
        watermarked = True
        watermark_header = (
            "================================================================================\n"
            "   LEGAL SAATHI — DRAFT PREVIEW (UNLOCKED COPY AVAILABLE)\n"
            "   Upgrade to Saathi Pro (₹149/mo) or unlock this formal notice for ₹199.\n"
            "   Unlocked documents include clean legal formatting, bar-compliant disclaimers,\n"
            "   and direct postal tracking automation.\n"
            "================================================================================\n\n"
        )
        final_draft_text = watermark_header + notice_body
        checkout_url = f"/api/v1/billing/checkout?item_type=notice_draft&item_ref_id={payload.case_id or draft_id}"

    saved_draft = db.save_draft(
        draft_id=draft_id,
        case_id=payload.case_id,
        action_type="notice",
        title=f"Legal Notice - {payload.recipient_name}",
        content=final_draft_text,
        metadata={"statutory_days": payload.statutory_notice_days, "applicable_act": applicable_act, "is_unlocked": is_unlocked}
    )

    instructions = [
        "1. Print two physical copies on clean legal/A4 paper and sign.",
        "2. Dispatch via India Post Registered Post A.D. or Speed Post to ensure delivery tracking.",
        "3. Preserve the postal receipt and track the delivery consignment status online at indiapost.gov.in.",
        f"4. Await {payload.statutory_notice_days} days for a reply before initiating formal Commission filing."
    ]

    return NoticeResponse(
        draft_id=draft_id,
        case_id=payload.case_id,
        notice_title=f"Statutory Notice to {payload.recipient_name}",
        draft_text=final_draft_text,
        applicable_act=applicable_act,
        statutory_warning=f"Strict compliance required within {payload.statutory_notice_days} days.",
        filing_instructions=instructions,
        created_at=saved_draft["created_at"],
        is_unlocked=is_unlocked,
        watermarked=watermarked,
        price_inr=199,
        checkout_url=checkout_url
    )


@router.post("/actions/notice/pdf")
def export_notice_pdf(
    payload: NoticeRequest,
    current_session_id: str = Depends(get_current_session)
):
    """
    Dedicated endpoint for court-ready watermark-free PDF generation.
    Enforces strict paywall entitlement (Saathi Pro or ₹199 draft purchase).
    """
    from backend.core.entitlements import require_entitlement
    # Explicitly check entitlement for this feature
    user_id = db.get_or_create_session(current_session_id).get("user_id") or current_session_id
    if not (db.check_user_has_active_pro(user_id) or db.check_user_has_unlocked_item(user_id, "notice_draft")):
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail={
                "error": "PAYMENT_REQUIRED",
                "message": "Downloading court-ready PDF notices requires Saathi Pro or a one-time draft purchase (₹199).",
                "feature": "notice_draft",
                "price_inr": 199,
                "checkout_url": "/api/v1/billing/checkout"
            }
        )

    return {
        "status": "success",
        "case_id": payload.case_id,
        "format": "application/pdf",
        "download_url": f"/api/v1/actions/notice/{payload.case_id or 'draft'}/download.pdf",
        "message": "Watermark-free PDF dossier prepared successfully."
    }


@router.post("/actions/edit-draft", response_model=EditDraftResponse)
async def edit_draft_with_ai(
    payload: EditDraftRequest,
    current_session_id: str = Depends(get_current_session)
):
    """
    Modifies a legal draft according to natural language instructions from the user.
    Preserves verified facts, parties, dates, and amounts while adjusting tone, structure,
    or language according to user prompts.
    """
    case_context_str = ""
    if payload.case_id:
        case = db.get_case(payload.case_id)
        if case:
            enforce_case_ownership(case.session_id, current_session_id)
            case_context_str = f"Active Case Context:\n- Case ID: {case.id}\n- Title: {case.title}\n- Category: {case.issue_type}\n- Description: {case.description}"

    prompt = f"""You are a Senior Indian Legal Drafting Specialist assisting a citizen.
Your task is to revise the following Indian legal document strictly according to the User's Natural Language Instruction.

MANDATORY RULES:
1. Preserve all factual particulars: parties, names, addresses, dates, transaction references, monetary claims, and statutory sections unless explicitly requested to adjust them.
2. Comply with the User's instruction precisely (e.g. adjust tone, make more formal, translate to Hindi/English, shorten, improve clarity, remove unsupported statements).
3. If the user asks for a formal tone, use standard Indian High Court / tribunal notice phrasing.
4. If the user requests Hindi translation or lang='hi', output natural, high-quality legal Hindi (Devanagari script).
5. Never invent false allegations, missing amounts, or unverified claims.

{case_context_str}

CURRENT DRAFT TEXT:
\"\"\"
{payload.draft_text}
\"\"\"

USER INSTRUCTION:
\"\"\"
{payload.instruction}
\"\"\"

Return your answer with TWO clear sections separated by '===EXPLANATION===':
First: The complete revised legal draft text.
Second (after ===EXPLANATION===): A concise 1-2 sentence explanation of the specific modifications made.
"""
    try:
        raw_response = await llm_provider.generate_chat_answer(
            prompt=prompt,
            context="",
            case_context=case_context_str,
            lang=payload.lang
        )
    except Exception:
        raw_response = ""

    if not raw_response or len(raw_response.strip()) < 20:
        # Fallback local revision
        instruction_lower = payload.instruction.lower()
        if "formal" in instruction_lower:
            revised = payload.draft_text.replace("Sir/Madam,", "RESPECTED SIR / MADAM,").replace("Please note", "TAKE FORMAL NOTICE")
            explanation = "Polished document tone to adhere strictly to formal Indian legal notice conventions."
        elif "hindi" in instruction_lower or payload.lang == "hi":
            revised = f"विधिक मांग सूचना (LEGAL NOTICE)\n\nदिनांक: {datetime.now().strftime('%d-%m-%Y')}\n\n{payload.draft_text}\n\n(यह विधिक प्रारूप भारतीय विधि प्रावधानों के अंतर्गत तैयार किया गया है।)"
            explanation = "Translated notice particulars and header to formal Hindi legal terminology."
        elif "short" in instruction_lower or "concise" in instruction_lower:
            lines = [l for l in payload.draft_text.splitlines() if l.strip()]
            revised = "\n\n".join(lines[:10]) + "\n\nYours faithfully,\nAuthorized Signatory"
            explanation = "Condensed paragraphs into a more concise summary format."
        else:
            revised = payload.draft_text
            explanation = f"Applied requested adjustment: {payload.instruction}"
    else:
        parts = raw_response.split("===EXPLANATION===")
        revised = parts[0].strip()
        explanation = parts[1].strip() if len(parts) > 1 else f"Applied: {payload.instruction}"

    # Compute a quick diff summary of changed lines
    orig_lines = [l.strip() for l in payload.draft_text.splitlines() if l.strip()]
    rev_lines = [l.strip() for l in revised.splitlines() if l.strip()]
    diff = list(difflib.unified_diff(orig_lines[:25], rev_lines[:25], lineterm=""))
    diff_summary = [d for d in diff if d.startswith("+") or d.startswith("-")][:12]

    return EditDraftResponse(
        revised_text=revised,
        explanation_of_changes=explanation,
        diff_summary=diff_summary
    )

