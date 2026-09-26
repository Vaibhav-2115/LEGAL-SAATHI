"""
Legal Saathi - Billing & Revenue Test Suite (test_billing.py)
Validates plans, checkout creation, HMAC signature verification, GST invoices,
collective escrow contributions, and entitlement gatekeeping per
LEGAL_SAATHI_REVENUE_BACKEND_SPEC.md.
"""

import hashlib
import hmac
import uuid
import pytest
from fastapi.testclient import TestClient

from backend.main import app
from backend.core.config import settings
from backend.data.db import db

client = TestClient(app)


def test_get_plans():
    """Verifies that all 5 public subscription tiers are returned with correct pricing."""
    response = client.get("/api/v1/billing/plans")
    assert response.status_code == 200
    plans = response.json()
    assert len(plans) >= 5

    plan_ids = [p["plan_id"] for p in plans]
    assert "plan_civic" in plan_ids
    assert "plan_pro_monthly" in plan_ids
    assert "plan_pro_annual" in plan_ids
    assert "plan_advocate_monthly" in plan_ids

    civic_plan = next(p for p in plans if p["plan_id"] == "plan_civic")
    assert civic_plan["amount_inr"] == 0
    assert civic_plan["tier"] == "civic"

    pro_plan = next(p for p in plans if p["plan_id"] == "plan_pro_monthly")
    assert pro_plan["amount_inr"] == 149
    assert pro_plan["tier"] == "pro"


def test_checkout_subscription_flow():
    """Tests creating a checkout order for Saathi Pro subscription."""
    session_id = f"test_sess_sub_{uuid.uuid4().hex[:8]}"
    headers = {"X-Session-ID": session_id}
    payload = {
        "item_type": "subscription",
        "plan_id": "plan_pro_monthly",
        "customer_name": "Ramesh Kumar",
        "customer_email": "ramesh@example.com"
    }
    response = client.post("/api/v1/billing/checkout", json=payload, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["order_id"].startswith("ord_")
    assert data["amount_inr"] == 149
    assert data["amount_paise"] == 14900
    assert data["currency"] == "INR"
    assert data["item_type"] == "subscription"


def test_checkout_microtransaction_notice_flow():
    """Tests creating a one-time micro-transaction order for a legal notice (₹199)."""
    session_id = f"test_sess_notice_{uuid.uuid4().hex[:8]}"
    headers = {"X-Session-ID": session_id}
    payload = {
        "item_type": "notice_draft",
        "item_ref_id": "case_consumer_001",
        "customer_name": "Priya Sharma"
    }
    response = client.post("/api/v1/billing/checkout", json=payload, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["amount_inr"] == 199
    assert data["amount_paise"] == 19900
    assert data["item_type"] == "notice_draft"


def test_verify_payment_and_invoice_generation():
    """Tests HMAC signature verification, entitlement unlocking, and GST invoice generation."""
    session_id = f"test_sess_verify_{uuid.uuid4().hex[:8]}"
    headers = {"X-Session-ID": session_id}

    # 1. Create order
    checkout_res = client.post("/api/v1/billing/checkout", json={
        "item_type": "subscription",
        "plan_id": "plan_pro_monthly",
        "customer_name": "Amitabh Verma"
    }, headers=headers)
    assert checkout_res.status_code == 200
    order_data = checkout_res.json()

    # 2. Compute authentic HMAC-SHA256 signature
    rzp_order_id = order_data["gateway_order_id"]
    rzp_payment_id = "pay_test_987654321"
    sig_payload = f"{rzp_order_id}|{rzp_payment_id}"
    valid_sig = hmac.new(
        settings.RAZORPAY_KEY_SECRET.encode("utf-8"),
        sig_payload.encode("utf-8"),
        hashlib.sha256
    ).hexdigest()

    # 3. Call verify endpoint
    verify_res = client.post("/api/v1/billing/verify", json={
        "order_id": order_data["order_id"],
        "razorpay_order_id": rzp_order_id,
        "razorpay_payment_id": rzp_payment_id,
        "razorpay_signature": valid_sig
    }, headers=headers)
    assert verify_res.status_code == 200
    verify_data = verify_res.json()
    assert verify_data["status"] == "success"
    assert "activated until" in verify_data["unlocked_entitlement"]
    assert verify_data["invoice_id"].startswith("INV-2026-")

    # 4. Check subscription status is now Pro
    sub_res = client.get("/api/v1/billing/subscription", headers=headers)
    assert sub_res.status_code == 200
    sub_data = sub_res.json()
    assert sub_data["tier"] == "pro"
    assert sub_data["is_active"] is True
    assert sub_data["can_export_pdf_dossier"] is True

    # 5. Check invoice was recorded with 18% GST (SAC 998311)
    inv_res = client.get("/api/v1/billing/invoices", headers=headers)
    assert inv_res.status_code == 200
    invoices = inv_res.json()
    assert len(invoices) >= 1
    inv = invoices[0]
    assert inv["sac_code"] == "998311"
    assert inv["total_amount_inr"] == 149.0
    assert inv["base_amount_inr"] + inv["cgst_inr"] + inv["sgst_inr"] + inv["igst_inr"] == pytest.approx(149.0, abs=0.5)


def test_entitlement_gatekeeper_on_pdf_export():
    """
    Tests that downloading formal PDF notice is paywalled (402 Payment Required)
    for civic free users, and unlocks once paid.
    """
    session_id = f"test_sess_gatekeeper_{uuid.uuid4().hex[:8]}"
    headers = {"X-Session-ID": session_id}

    notice_payload = {
        "sender_name": "Vikram Patel",
        "sender_address": "Indiranagar, Bengaluru",
        "recipient_name": "ABC Electronics Ltd",
        "recipient_address": "Koramangala, Bengaluru",
        "subject": "Notice for Defective Washing Machine",
        "issue_type": "consumer",
        "facts": ["Machine ceased working within 2 days of delivery."],
        "demands": ["Full refund of Rs 25,000."]
    }

    # 1. Calling /actions/notice returns free preview draft with watermark note
    preview_res = client.post("/api/v1/actions/notice", json=notice_payload, headers=headers)
    assert preview_res.status_code == 200
    preview_data = preview_res.json()
    assert preview_data["is_unlocked"] is False
    assert preview_data["watermarked"] is True
    assert "DRAFT PREVIEW" in preview_data["draft_text"]

    # 2. Calling strict PDF export without entitlement returns 402 PAYMENT_REQUIRED
    pdf_res = client.post("/api/v1/actions/notice/pdf", json=notice_payload, headers=headers)
    assert pdf_res.status_code == 402
    err_data = pdf_res.json()
    assert err_data["detail"]["error"] == "PAYMENT_REQUIRED"
    assert err_data["detail"]["feature"] == "notice_draft"

    # 3. Pay for the notice_draft item
    user_id = db.get_or_create_session(session_id)["user_id"]
    ord_id = f"ord_test_unlock_{session_id}"
    db.create_payment_order(
        order_id=ord_id,
        user_id=user_id,
        gateway_order_id=f"gw_{ord_id}",
        item_type="notice_draft",
        amount_inr=19900
    )
    db.update_payment_order_status(ord_id, "paid", signature="sig_test_paid")

    # 4. Now PDF export succeeds!
    pdf_unlocked_res = client.post("/api/v1/actions/notice/pdf", json=notice_payload, headers=headers)
    assert pdf_unlocked_res.status_code == 200
    assert pdf_unlocked_res.json()["status"] == "success"

    # And /actions/notice now generates clean unlocked draft
    clean_notice_res = client.post("/api/v1/actions/notice", json=notice_payload, headers=headers)
    assert clean_notice_res.status_code == 200
    assert clean_notice_res.json()["is_unlocked"] is True
    assert clean_notice_res.json()["watermarked"] is False


def test_collective_action_docket_pledge():
    """Tests pledging to a group litigation / conciliation cluster pool."""
    headers = {"X-Session-ID": f"test_sess_collective_{uuid.uuid4().hex[:8]}"}
    pledge_payload = {
        "cluster_id": "cluster_bengaluru_deposit_withholding",
        "pledge_amount_inr": 499,
        "claimant_name": "Siddharth Rao",
        "claimant_email": "siddharth@example.com"
    }
    res = client.post("/api/v1/billing/collective/pledge", json=pledge_payload, headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["amount_inr"] == 499
    assert data["cluster_id"] == "cluster_bengaluru_deposit_withholding"
    assert data["checkout_order"]["amount_inr"] == 499
