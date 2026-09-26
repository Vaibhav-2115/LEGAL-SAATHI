"""
Legal Saathi - AI Model & Revenue Integration Test Suite (test_ai_billing_integration.py)
Validates that the AI pipeline correctly integrates entitlement awareness,
pricing transparency, collective action docket discovery, and free civic access.
"""

import pytest
from fastapi.testclient import TestClient

from backend.main import app
from backend.data.db import db

client = TestClient(app)


def test_ai_model_chat_consumer_pricing():
    """
    Validates that when a civic user discusses a consumer dispute,
    the AI model returns a grounded explanation and transparently gates
    the formal 15-day statutory notice draft (₹199 / Saathi Pro).
    """
    session_id = "test_sess_ai_civic_001"
    headers = {"X-Session-ID": session_id}

    chat_payload = {
        "text": "I purchased an air conditioner online and it broke down within 4 days. The seller refuses to refund my Rs 35,000.",
        "lang": "en"
    }

    response = client.post("/api/v1/chat", json=chat_payload, headers=headers)
    assert response.status_code == 200
    data = response.json()

    # Grounded AI model response verification
    assert len(data["answer"]) > 50
    assert data["issue_type"] == "consumer"
    assert data["confidence"] in ("strong", "partial")
    assert len(data["citations"]) >= 1

    # Revenue & Entitlement integration
    assert data["user_tier"] == "civic"
    action = data["suggested_action"]
    assert action["type"] == "notice"
    assert action["is_premium"] is True
    assert action["cost_inr"] == 199
    assert action["entitlement_feature"] == "notice_draft"
    assert action["checkout_url"] is not None
    assert "notice_draft" in action["checkout_url"]


def test_ai_model_chat_pro_user_entitled():
    """
    Validates that when a Saathi Pro subscriber chats with the AI model,
    the suggested formal notice draft is automatically unlocked (is_premium=False, cost_inr=0).
    """
    session_id = "test_sess_ai_pro_002"
    headers = {"X-Session-ID": session_id}

    # Provision active Saathi Pro subscription
    user_id = db.get_or_create_session(session_id)["user_id"]
    db.create_or_update_subscription(
        subscription_id=f"sub_test_{session_id}",
        user_id=user_id,
        plan_id="plan_pro_monthly",
        status="active",
        current_period_start="2026-01-01T00:00:00Z",
        current_period_end="2027-01-01T00:00:00Z"
    )

    chat_payload = {
        "text": "The laptop delivered to me has a cracked screen and the store claims no return policy.",
        "lang": "en"
    }

    response = client.post("/api/v1/chat", json=chat_payload, headers=headers)
    assert response.status_code == 200
    data = response.json()

    # Pro subscriber entitlements
    assert data["user_tier"] == "pro"
    assert data["is_entitled"] is True
    action = data["suggested_action"]
    assert action["type"] == "notice"
    assert action["is_premium"] is False
    assert action["cost_inr"] == 0
    assert action["checkout_url"] is None


def test_ai_model_collective_action_docket_detection():
    """
    Validates that when a citizen query matches an active incident cluster (e.g. Bengaluru tenancy),
    the AI model intelligently suggests the Collective Action Docket (₹499 shared cost).
    """
    session_id = "test_sess_ai_col_003"
    headers = {"X-Session-ID": session_id}

    # Ensure a cluster exists in the database
    cluster_id = "cluster_bengaluru_deposit_withholding"
    db.save_cluster(
        cluster_id=cluster_id,
        issue_type="tenancy",
        locality_bucket="Bengaluru",
        explanation_text="Widespread refusal by landlords to return rental deposits upon move-out in Bengaluru.",
        incident_ids=["inc_bg_1", "inc_bg_2", "inc_bg_3"]
    )

    chat_payload = {
        "text": "My landlord in Bengaluru is refusing to return my security deposit of Rs 75,000 after moving out.",
        "lang": "en"
    }

    response = client.post("/api/v1/chat", json=chat_payload, headers=headers)
    assert response.status_code == 200
    data = response.json()

    action = data["suggested_action"]
    assert action["type"] == "collective"
    assert "Collective Action Docket" in action["title"]
    assert action["cost_inr"] == 499
    assert action["payload"]["cluster_id"] == cluster_id
    assert action["endpoint"] == "/api/v1/billing/collective/pledge"


def test_ai_model_free_civic_access_untouched():
    """
    Validates that fundamental legal aid (DLSA/NALSA) and rights checklists
    remain 100% free under Indian law (Article 39A).
    """
    session_id = "test_sess_ai_free_004"
    headers = {"X-Session-ID": session_id}

    chat_payload = {
        "text": "I cannot afford a lawyer and need free legal aid for my case.",
        "lang": "en"
    }

    response = client.post("/api/v1/chat", json=chat_payload, headers=headers)
    assert response.status_code == 200
    data = response.json()

    action = data["suggested_action"]
    assert action["type"] == "dlsa"
    assert action["is_premium"] is False
    assert action["cost_inr"] == 0
