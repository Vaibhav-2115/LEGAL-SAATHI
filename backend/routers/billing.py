"""
Legal Saathi - Billing & Revenue Router (billing.py)
Implements Section 4 of LEGAL_SAATHI_REVENUE_BACKEND_SPEC.md.
Provides endpoints for plans, checkout, payment verification, webhook handling,
subscription status, and GST invoices.
"""

import hashlib
import hmac
import json
from typing import List, Optional
from fastapi import APIRouter, Depends, Header, HTTPException, Request, status

from backend.core.auth import get_current_session
from backend.core.config import settings
from backend.core.entitlements import get_user_entitlements, get_user_id_from_session
from backend.core.logging import logger
from backend.data.db import db
from backend.schemas.billing import (
    CheckoutResponse,
    CollectiveContributionRequest,
    CollectiveContributionResponse,
    CreateCheckoutRequest,
    InvoiceItemResponse,
    PlanResponse,
    SubscriptionStatusResponse,
    VerifyPaymentRequest,
    VerifyPaymentResponse
)
from backend.services.billing_service import billing_service

router = APIRouter(prefix="/billing", tags=["Billing & Revenue"])


@router.get("/plans", response_model=List[PlanResponse])
def get_subscription_plans():
    """
    Public endpoint providing available tiers, pricing, and features.
    Prices are presented in INR Rupees for client presentation.
    """
    plans = db.get_subscription_plans(active_only=True)
    return [
        PlanResponse(
            plan_id=p["plan_id"],
            name=p["name"],
            tier=p["tier"],
            amount_inr=p["amount_inr"] // 100,  # Convert paise to rupees
            billing_period=p["billing_period"],
            features=p["features"],
            is_active=bool(p["is_active"])
        )
        for p in plans
    ]


@router.post("/checkout", response_model=CheckoutResponse)
def create_checkout_session(
    payload: CreateCheckoutRequest,
    session_id: str = Depends(get_current_session)
):
    """
    Initializes a payment order in Razorpay and registers an internal order.
    Returns Razorpay order ID and key ID for client-side modal invocation.
    """
    user_id = get_user_id_from_session(session_id)
    try:
        checkout = billing_service.create_checkout_order(payload, user_id=user_id)
        return checkout
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "invalid_checkout_request", "message": str(e)}
        )


@router.post("/verify", response_model=VerifyPaymentResponse)
def verify_payment(
    payload: VerifyPaymentRequest,
    session_id: str = Depends(get_current_session)
):
    """
    Verifies payment authenticity via HMAC-SHA256 signature.
    Unlocks entitlements (Pro subscription or single draft) and creates GST invoice.
    """
    user_id = get_user_id_from_session(session_id)
    try:
        result = billing_service.verify_payment_signature(payload, user_id=user_id)
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "payment_verification_failed", "message": str(e)}
        )


@router.get("/subscription", response_model=SubscriptionStatusResponse)
def get_subscription_status(
    session_id: str = Depends(get_current_session)
):
    """
    Returns current subscription status and feature allowances for the logged-in session.
    """
    user_id = get_user_id_from_session(session_id)
    entitlements = get_user_entitlements(user_id)
    sub = db.get_user_subscription(user_id)

    if sub and entitlements["is_pro"]:
        return SubscriptionStatusResponse(
            tier=sub.get("plan_tier", "pro"),
            plan_name=sub.get("plan_name", "Saathi Pro"),
            is_active=True,
            current_period_end=sub.get("current_period_end"),
            allowed_drafts_remaining="unlimited",
            can_export_pdf_dossier=True,
            can_access_collective_dockets=True
        )
    else:
        return SubscriptionStatusResponse(
            tier="civic",
            plan_name="Bharat Civic Access (Free)",
            is_active=True,
            current_period_end=None,
            allowed_drafts_remaining=0,
            can_export_pdf_dossier=False,
            can_access_collective_dockets=False
        )


@router.get("/invoices", response_model=List[InvoiceItemResponse])
def list_invoices(
    session_id: str = Depends(get_current_session)
):
    """
    Lists historical tax receipts with 18% GST breakdown (SAC Code 998311).
    """
    user_id = get_user_id_from_session(session_id)
    raw_invoices = db.list_user_invoices(user_id)

    res = []
    for inv in raw_invoices:
        base_rs = inv["base_amount_inr"] / 100.0
        cgst_rs = inv["cgst_inr"] / 100.0
        sgst_rs = inv["sgst_inr"] / 100.0
        igst_rs = inv["igst_inr"] / 100.0
        total_rs = inv["total_amount_inr"] / 100.0

        res.append(InvoiceItemResponse(
            invoice_id=inv["invoice_id"],
            order_id=inv["order_id"],
            customer_name=inv["customer_name"],
            customer_state=inv["customer_state"],
            sac_code=inv["sac_code"],
            base_amount_inr=base_rs,
            cgst_inr=cgst_rs,
            sgst_inr=sgst_rs,
            igst_inr=igst_rs,
            total_amount_inr=total_rs,
            created_at=inv["created_at"],
            invoice_pdf_url=inv["invoice_pdf_url"]
        ))
    return res


@router.post("/collective/pledge", response_model=CollectiveContributionResponse)
def pledge_collective_docket(
    payload: CollectiveContributionRequest,
    session_id: str = Depends(get_current_session)
):
    """
    Allows a citizen claimant in an incident cluster to pledge to the collective escrow pool.
    Returns checkout order to complete the micro-pledge (e.g. ₹499).
    """
    user_id = get_user_id_from_session(session_id)
    contrib_id = f"contrib_{session_id[:8]}"

    # Create checkout order for the collective pledge
    checkout_req = CreateCheckoutRequest(
        item_type="collective_docket",
        item_ref_id=payload.cluster_id,
        amount_inr=payload.pledge_amount_inr,
        customer_name=payload.claimant_name,
        customer_email=payload.claimant_email,
        customer_phone=payload.claimant_phone
    )
    checkout = billing_service.create_checkout_order(checkout_req, user_id=user_id)

    return CollectiveContributionResponse(
        contribution_id=contrib_id,
        cluster_id=payload.cluster_id,
        amount_inr=payload.pledge_amount_inr,
        status="order_created",
        checkout_order=checkout,
        message=(
            f"Collective Action Docket pledge initialized for Cluster {payload.cluster_id}. "
            f"Complete checkout of ₹{payload.pledge_amount_inr} to activate group legal conciliation."
        )
    )


@router.post("/webhook")
async def razorpay_webhook(
    request: Request,
    x_razorpay_signature: Optional[str] = Header(None, alias="X-Razorpay-Signature")
):
    """
    Asynchronous payment gateway notification webhook.
    Verifies payload HMAC-SHA256 signature to prevent spoofing.
    """
    body_bytes = await request.body()

    if settings.RAZORPAY_WEBHOOK_SECRET and not settings.RAZORPAY_WEBHOOK_SECRET.startswith("rzp_test"):
        if not x_razorpay_signature:
            raise HTTPException(status_code=400, detail="Missing webhook signature")

        expected_sig = hmac.new(
            settings.RAZORPAY_WEBHOOK_SECRET.encode("utf-8"),
            body_bytes,
            hashlib.sha256
        ).hexdigest()

        if not hmac.compare_digest(expected_sig, x_razorpay_signature):
            logger.warning("Invalid Razorpay webhook signature received")
            raise HTTPException(status_code=400, detail="Invalid Webhook Signature")

    try:
        data = json.loads(body_bytes.decode("utf-8")) if body_bytes else {}
    except Exception:
        data = {}

    event = data.get("event", "unknown")
    logger.info(f"Received Razorpay webhook event: {event}")

    # Process events like payment.captured or subscription.charged
    if event == "payment.captured":
        payload_entity = data.get("payload", {}).get("payment", {}).get("entity", {})
        rzp_order_id = payload_entity.get("order_id")
        rzp_payment_id = payload_entity.get("id")
        if rzp_order_id:
            order = db.get_payment_order_by_gateway_id(rzp_order_id)
            if order and order["status"] != "paid":
                db.update_payment_order_status(
                    order_id=order["order_id"],
                    status="paid",
                    signature=rzp_payment_id
                )

    return {"status": "received", "event": event}
