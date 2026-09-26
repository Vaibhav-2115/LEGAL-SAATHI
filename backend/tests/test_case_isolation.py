"""
Legal Saathi - Comprehensive Automated Test Suite (test_case_isolation.py)
Tests:
1. Case Context Isolation (Builder delay vs Tenancy vs Labor vs Cyber)
2. Negative Tests (Strict zero landlord-tenant bias in non-tenancy cases)
3. Case Switching & Cross-Case Contamination Prevention
4. Data Quality States & Input Validation (Gibberish rejection & Incomplete prompting)
5. Multi-Domain Legal Classification across all 15 domains
6. Multilingual Responses (Hindi & English)
7. Security & Authorization (Cross-session access prevention)
"""

import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.data.db import db
from backend.safety.input_validation import assess_complaint_quality, is_gibberish, DataQualityState
from backend.services.classifier import classifier

client = TestClient(app)


# ==============================================================================
# 1. CASE ISOLATION & NEGATIVE TESTS
# ==============================================================================

def test_builder_possession_dispute_no_tenancy_bias():
    """
    Mandatory Regression Test:
    A case concerning builder delay in residential apartment possession
    MUST NOT generate landlord-tenant, rent, or security deposit advice.
    """
    session_id = "sess_builder_iso_001"
    headers = {"X-Session-ID": session_id}

    # 1. Create builder-buyer case
    case_resp = client.post(
        "/cases",
        headers=headers,
        json={
            "issue_type": "property_rera",
            "title": "Delayed Possession of Residential Apartment",
            "description": "The builder delayed possession of a residential apartment by 18 months beyond the promised date in the Builder-Buyer Agreement."
        }
    )
    assert case_resp.status_code == 200
    case_id = case_resp.json()["case_id"]

    # 2. Ask what legal provisions apply to this case
    chat_resp = client.post(
        "/chat",
        headers=headers,
        json={
            "text": "What legal provisions apply to my case?",
            "case_id": case_id,
            "session_id": session_id,
            "lang": "en"
        }
    )
    assert chat_resp.status_code == 200
    answer = chat_resp.json()["answer"].lower()

    # Affirmative assertions: Real estate / RERA / Consumer protection
    assert "rera" in answer or "real estate" in answer or "possession" in answer

    # STRICT NEGATIVE TEST: Zero tenancy / landlord / security deposit advice
    assert "security deposit" not in answer
    assert "landlord" not in answer
    assert "model tenancy act" not in answer
    assert "delhi rent act" not in answer


def test_landlord_tenant_dispute():
    """Verifies that a genuine tenancy dispute generates landlord-tenant analysis."""
    session_id = "sess_tenancy_iso_002"
    headers = {"X-Session-ID": session_id}

    case_resp = client.post(
        "/cases",
        headers=headers,
        json={
            "issue_type": "tenancy",
            "title": "Security Deposit Withheld by Landlord",
            "description": "Landlord refused to return my security deposit of Rs 65,000 after I vacated the apartment on time."
        }
    )
    assert case_resp.status_code == 200
    case_id = case_resp.json()["case_id"]

    chat_resp = client.post(
        "/chat",
        headers=headers,
        json={
            "text": "What can I do to recover my money?",
            "case_id": case_id,
            "session_id": session_id,
            "lang": "en"
        }
    )
    assert chat_resp.status_code == 200
    answer = chat_resp.json()["answer"].lower()
    assert "deposit" in answer or "tenancy" in answer or "landlord" in answer or "notice" in answer
    # Must NOT discuss builder delay
    assert "rera" not in answer


def test_employment_salary_dispute():
    """Verifies employment dispute analysis with zero property advice."""
    session_id = "sess_labor_iso_003"
    headers = {"X-Session-ID": session_id}

    case_resp = client.post(
        "/cases",
        headers=headers,
        json={
            "issue_type": "labor",
            "title": "Employer Withholding Salary for 2 Months",
            "description": "My employer has withheld two months of my salary without any reason after I resigned."
        }
    )
    assert case_resp.status_code == 200
    case_id = case_resp.json()["case_id"]

    chat_resp = client.post(
        "/chat",
        headers=headers,
        json={
            "text": "What legal action can I take against the company?",
            "case_id": case_id,
            "session_id": session_id,
            "lang": "en"
        }
    )
    assert chat_resp.status_code == 200
    answer = chat_resp.json()["answer"].lower()
    assert "wages" in answer or "salary" in answer or "employment" in answer or "contract" in answer
    # Must not contain tenancy or builder advice
    assert "landlord" not in answer
    assert "rera" not in answer


def test_cybercrime_dispute():
    """Verifies cyber financial fraud analysis and helpline 1930."""
    session_id = "sess_cyber_iso_004"
    headers = {"X-Session-ID": session_id}

    case_resp = client.post(
        "/cases",
        headers=headers,
        json={
            "issue_type": "cyber_fraud",
            "title": "Unauthorized UPI Debit From Bank Account",
            "description": "Someone hacked my account and transferred 50,000 rupees through unauthorized UPI transactions."
        }
    )
    assert case_resp.status_code == 200
    case_id = case_resp.json()["case_id"]

    chat_resp = client.post(
        "/chat",
        headers=headers,
        json={
            "text": "How do I report this fraud and get my money back?",
            "case_id": case_id,
            "session_id": session_id,
            "lang": "en"
        }
    )
    assert chat_resp.status_code == 200
    answer = chat_resp.json()["answer"].lower()
    assert any(k in answer for k in ["1930", "cyber", "information technology", "fraud", "police", "investigation"])
    assert "landlord" not in answer
    assert "rera" not in answer


def test_case_switching_isolation():
    """
    Tests opening Case A (builder delay), querying it, then opening Case B (salary withheld),
    and querying Case B to verify ZERO cross-case contamination.
    """
    session_id = "sess_switch_iso_005"
    headers = {"X-Session-ID": session_id}

    # Create Case A
    case_a = client.post(
        "/cases",
        headers=headers,
        json={
            "issue_type": "property_rera",
            "title": "Tower A Delayed Possession",
            "description": "Builder delayed handing over 3BHK flat by 18 months."
        }
    ).json()

    # Create Case B
    case_b = client.post(
        "/cases",
        headers=headers,
        json={
            "issue_type": "labor",
            "title": "Unpaid Tech Consultant Salary",
            "description": "Company refused to clear unpaid wages of Rs 1,20,000."
        }
    ).json()

    # Query Case A
    res_a = client.post(
        "/chat",
        headers=headers,
        json={"text": "What laws apply to my case?", "case_id": case_a["case_id"], "session_id": session_id}
    ).json()
    assert "rera" in res_a["answer"].lower() or "possession" in res_a["answer"].lower()
    assert "wages" not in res_a["answer"].lower()

    # Query Case B
    res_b = client.post(
        "/chat",
        headers=headers,
        json={"text": "What laws apply to my case?", "case_id": case_b["case_id"], "session_id": session_id}
    ).json()
    assert "wages" in res_b["answer"].lower() or "salary" in res_b["answer"].lower()
    assert "rera" not in res_b["answer"].lower()
    assert "flat" not in res_b["answer"].lower()


def test_cross_session_unauthorized_access():
    """Verifies that an authenticated user cannot access or chat on another user's case."""
    owner_session = "sess_user_alpha_111"
    intruder_session = "sess_user_beta_222"

    case = client.post(
        "/cases",
        headers={"X-Session-ID": owner_session},
        json={
            "issue_type": "consumer",
            "title": "Private Medical Equipment Refund Dispute",
            "description": "Defective CPAP machine purchased by citizen."
        }
    ).json()
    case_id = case["case_id"]

    # Intruder tries to GET the case
    get_resp = client.get(f"/cases/{case_id}", headers={"X-Session-ID": intruder_session})
    assert get_resp.status_code == 403

    # Intruder tries to query the case via /chat
    chat_resp = client.post(
        "/chat",
        headers={"X-Session-ID": intruder_session},
        json={"text": "Show me the case details", "case_id": case_id, "session_id": intruder_session}
    )
    assert chat_resp.status_code == 403


# ==============================================================================
# 2. INPUT VALIDATION & DATA QUALITY STATES
# ==============================================================================

def test_gibberish_input_rejected():
    """Verifies that meaningless keyboard mashing or random numbers are detected as INVALID."""
    assert is_gibberish("asdfghjkl") is True
    assert is_gibberish("qwertyuiop") is True
    assert is_gibberish("1234567890") is True
    assert is_gibberish("aaaaaaa") is True

    assessment = assess_complaint_quality("asdfghjkl zxcvbnm")
    assert assessment["state"] == DataQualityState.INVALID
    assert assessment["can_finalize"] is False

    # Endpoint must return 400 Bad Request
    resp = client.post("/chat", json={"text": "asdfghjkl zxcvbnm"})
    assert resp.status_code == 400
    assert "meaningless or random" in resp.json()["detail"]["message"].lower()


def test_out_of_scope_query():
    """Verifies out-of-scope non-legal queries."""
    assessment = assess_complaint_quality("what is the cricket score today")
    assert assessment["state"] == DataQualityState.OUT_OF_SCOPE
    assert assessment["can_finalize"] is False


def test_valid_but_incomplete_short_complaint():
    """Legitimate brief complaint is NOT rejected as invalid, but flagged as VALID_BUT_INCOMPLETE."""
    assessment = assess_complaint_quality("My salary was withheld for 2 months")
    assert assessment["is_valid"] is True
    assert assessment["state"] == DataQualityState.VALID_BUT_INCOMPLETE
    assert assessment["can_finalize"] is False
    assert len(assessment["clarifying_questions"]) > 0


def test_valid_detailed_complaint():
    """Substantial complaint with dates and parties is flagged as VALID and can be finalized."""
    text = "The builder delayed possession of my flat by 18 months beyond the agreed date of March 2024. All consideration paid."
    assessment = assess_complaint_quality(text)
    assert assessment["state"] == DataQualityState.VALID
    assert assessment["can_finalize"] is True


# ==============================================================================
# 3. MULTILINGUAL RESPONSES
# ==============================================================================

def test_multilingual_hindi_response():
    """Verifies Hindi response generation for builder possession dispute."""
    session_id = "sess_hindi_test_006"
    headers = {"X-Session-ID": session_id}

    chat_resp = client.post(
        "/chat",
        headers=headers,
        json={
            "text": "बिल्डर ने फ्लैट के पजेशन में 18 महीने की देरी की है। मुझे क्या करना चाहिए?",
            "session_id": session_id,
            "lang": "hi"
        }
    )
    assert chat_resp.status_code == 200
    answer = chat_resp.json()["answer"]
    # Verify Devanagari Hindi content
    assert any('\u0900' <= char <= '\u097F' for char in answer)
    assert "रेरा" in answer or "पजेशन" in answer or "बिल्डर" in answer or "कानून" in answer


# ==============================================================================
# 4. BROAD 15 LEGAL DOMAINS TAXONOMY
# ==============================================================================

def test_broad_legal_classification_domains():
    """Verifies domain identification across the supported Indian legal domains."""
    test_cases = [
        ("The builder delayed possession of apartment", "property_rera"),
        ("Landlord refuses to return security deposit", "tenancy"),
        ("Bank recovery agent is harassing and threatening me", "banking_finance"),
        ("Employer withheld unpaid wages and gratuity", "labor"),
        ("Defective laptop delivered by seller, refund refused", "consumer"),
        ("Unauthorized UPI transaction emptied my bank account", "cyber_fraud"),
        ("Divorce petition and child custody maintenance", "family_domestic"),
        ("Physical assault and threats to life at my home", "criminal"),
        ("Sexual harassment at workplace by manager POSH", "women_child"),
        ("Breach of vendor service contract agreement and damages", "civil_contract"),
        ("College refused to refund admission fees", "education"),
        ("Filed RTI application to public authority but no response", "government_public"),
        ("Old age pension application withheld by office", "welfare_identity"),
        ("Hospital medical negligence caused patient injury", "healthcare"),
        ("Cannot afford a lawyer and need free legal aid", "legal_aid"),
    ]

    for query, expected_domain in test_cases:
        res = classifier.classify(query)
        assert res.issue_type == expected_domain, f"Query '{query}' classified as '{res.issue_type}', expected '{expected_domain}'"
        assert res.domain is not None
