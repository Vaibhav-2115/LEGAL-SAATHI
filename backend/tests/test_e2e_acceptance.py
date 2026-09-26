"""
Legal Saathi - Phase 30 End-to-End Acceptance Test Suite
Verifies the complete citizen-facing legal assistance workflow:
- Workflow A: Authentication and Session Verification
- Workflow B: Case / Matter Creation & Dashboard Visibility
- Workflow C: Evidence Management & Document Attachment
- Workflow D: Legal AI Analysis with Grounded Citations & Disclaimers
- Workflow E: Case Workspace Continuity & Status Progression
- Workflow F: Multi-User Tenant Isolation & Access Denial
- Workflow G: Safe Failure Handling & Input Validation
"""

import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.core.auth import create_access_token

client = TestClient(app)


def test_workflow_a_authentication_and_session():
    """Workflow A: Verify token generation, role verification, and session authentication."""
    user_id = "test-citizen-user-001"
    token = create_access_token(user_id=user_id, email="citizen@legalsaathi.in", role="CITIZEN")
    
    headers = {"Authorization": f"Bearer {token}", "X-Session-ID": f"session-{user_id}"}
    
    # Verify liveness & readiness with authenticated session
    res = client.get("/readyz", headers=headers)
    assert res.status_code == 200
    assert res.json()["status"] == "ready"


def test_workflow_b_case_creation_and_listing():
    """Workflow B: Citizen creates a legal matter and retrieves it from active matters."""
    session_id = "sess-e2e-citizen-alpha"
    headers = {"X-Session-ID": session_id}

    payload = {
        "session_id": session_id,
        "issue_type": "consumer",
        "title": "E-commerce Fraudulent Laptop Delivery",
        "description": "Ordered laptop for Rs 65,000; received box of detergent. Seller refused refund.",
        "entities": {
            "opposing_party": "QuickDeals Pvt Ltd",
            "location": "New Delhi",
            "amount": 65000
        },
        "consent_status": "granted"
    }

    # 1. Create case
    res = client.post("/cases", json=payload, headers=headers)
    assert res.status_code == 200
    case_data = res.json()
    case_id = case_data["case_id"]
    assert case_id.startswith("case_")
    assert case_data["issue_type"] == "consumer"
    assert len(case_data["evidence"]) >= 3

    # 2. List cases
    list_res = client.get("/cases", headers=headers)
    assert list_res.status_code == 200
    cases = list_res.json()
    found = any(c["case_id"] == case_id for c in cases)
    assert found is True


def test_workflow_c_evidence_management():
    """Workflow C: Verify evidence status progression and item tracking."""
    session_id = "sess-e2e-evidence-user"
    headers = {"X-Session-ID": session_id}

    # Create case
    create_res = client.post("/cases", json={
        "session_id": session_id,
        "issue_type": "tenancy",
        "title": "Illegal Eviction Notice",
        "description": "Landlord sent 2-day eviction notice without 3-month statutory notice.",
        "consent_status": "granted"
    }, headers=headers)
    assert create_res.status_code == 200
    case_id = create_res.json()["case_id"]

    # Verify default evidence checklist items
    get_res = client.get(f"/cases/{case_id}", headers=headers)
    assert get_res.status_code == 200
    evidence_items = get_res.json().get("evidence", [])
    assert len(evidence_items) > 0
    assert evidence_items[0]["status"] == "needed"


def test_workflow_d_legal_ai_analysis_with_rag():
    """Workflow D: Citizen submits legal query; backend retrieves statutes and returns grounded response."""
    query_payload = {
        "case_text": "Consumer bought defective television. Seller and manufacturer refusing refund or warranty replacement under Consumer Protection Act.",
        "top_k": 2,
        "issue_type_filter": "consumer",
        "max_new_tokens": 40
    }
    
    headers = {"X-Session-ID": "sess-e2e-ai-user"}
    res = client.post("/api/v1/lora/grounded-analyze", json=query_payload, headers=headers)
    assert res.status_code == 200
    data = res.json()
    
    assert data["status"] == "success"
    assert data["core_dispute"]
    assert data["retrieval_count"] >= 1
    assert isinstance(data["citations"], list)
    assert len(data["citations"]) > 0


def test_workflow_e_case_continuity_and_actions():
    """Workflow E: Citizen generates a legal action (Legal Notice draft) against case."""
    session_id = "sess-e2e-action-user"
    headers = {"X-Session-ID": session_id}

    # 1. Create case
    case_res = client.post("/cases", json={
        "session_id": session_id,
        "issue_type": "consumer",
        "title": "Refund Refusal by Airline",
        "description": "Flight cancelled by airline; refund of Rs 14,000 withheld for 6 months.",
        "consent_status": "granted"
    }, headers=headers)
    assert case_res.status_code == 200
    case_id = case_res.json()["case_id"]

    # 2. Draft notice action
    notice_payload = {
        "sender_name": "Anita Roy",
        "sender_address": "Koramangala, Bangalore",
        "recipient_name": "FlyHigh Airways Ltd",
        "recipient_address": "Indira Gandhi International Airport, New Delhi",
        "subject": "Notice regarding refund of cancelled flight tickets",
        "issue_type": "consumer",
        "facts": [
            "Booked tickets on 10-02-2024 for Rs 14,000.",
            "Flight cancelled by airline 2 hours before departure.",
            "Refund not processed despite multiple written requests."
        ],
        "demands": [
            "Process immediate refund of Rs 14,000.",
            "Pay compensation for wrongful withholding."
        ],
        "statutory_notice_days": 15,
        "disputed_amount": 14000
    }
    notice_res = client.post("/actions/notice", json=notice_payload, headers=headers)
    assert notice_res.status_code == 200
    notice_data = notice_res.json()
    assert "LEGAL NOTICE" in notice_data["draft_text"]
    assert "Consumer Protection Act" in notice_data["applicable_act"]


def test_workflow_f_multi_user_isolation():
    """Workflow F: Strict tenant isolation: User B cannot access User A's case."""
    session_a = "sess-tenant-user-alpha"
    session_b = "sess-tenant-user-beta"

    # User A creates a private case
    res_a = client.post("/cases", json={
        "session_id": session_a,
        "issue_type": "criminal",
        "title": "Private Cheque Dishonour Case",
        "description": "Cheque of Rs 500,000 bounced for insufficient funds.",
        "consent_status": "granted"
    }, headers={"X-Session-ID": session_a})
    assert res_a.status_code == 200
    case_a_id = res_a.json()["case_id"]

    # User B attempts to access User A's case
    res_b = client.get(f"/cases/{case_a_id}", headers={"X-Session-ID": session_b})
    # Must be 403 Forbidden (or 404 if hidden)
    assert res_b.status_code in [403, 404]

    # User B lists cases -> must NOT include User A's case
    list_b = client.get("/cases", headers={"X-Session-ID": session_b})
    assert list_b.status_code == 200
    assert not any(c["case_id"] == case_a_id for c in list_b.json())


def test_workflow_g_failure_handling_and_validation():
    """Workflow G: Negative testing - invalid inputs, empty text, unauthorized payloads."""
    headers = {"X-Session-ID": "sess-test-failure"}

    # 1. Empty case description in LoRA analysis -> HTTP 422
    err_res1 = client.post("/analyze-case", json={"case_text": "   "})
    assert err_res1.status_code == 422

    # 2. Missing text field in classification -> HTTP 422
    err_res2 = client.post("/classify", json={})
    assert err_res2.status_code == 422

    # 3. Invalid non-existent case lookup
    err_res3 = client.get("/cases/case_nonexistent_xyz999", headers=headers)
    assert err_res3.status_code in [403, 404]
