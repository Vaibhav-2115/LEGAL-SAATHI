"""Tests for Action Modules (Notice, RTI, DLSA, e-FIR, Checklist)."""
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_notice_drafting():
    payload = {
        "sender_name": "Rohan Gupta",
        "sender_address": "Sector 62, Noida, UP",
        "recipient_name": "Apex Electronic Appliances Ltd",
        "recipient_address": "Connaught Place, New Delhi",
        "subject": "Notice regarding supply of defective television",
        "issue_type": "consumer",
        "facts": [
            "Purchased Smart TV Model X50 on 12-01-2024 for Rs 42,000.",
            "Display panel stopped working within 10 days of installation.",
            "Authorized service center refused warranty replacement."
        ],
        "demands": [
            "Replace the defective TV unit with a brand new unit.",
            "Pay compensation of Rs 15,000 for distress."
        ],
        "statutory_notice_days": 15,
        "disputed_amount": 42000
    }
    resp = client.post("/actions/notice", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "LEGAL NOTICE" in data["draft_text"]
    assert "Consumer Protection Act" in data["applicable_act"]
    assert "15 days" in data["statutory_warning"]


def test_rti_drafting():
    payload = {
        "applicant_name": "Sunita Verma",
        "applicant_address": "Indirapuram, Ghaziabad",
        "public_authority_name": "Municipal Corporation of Ghaziabad",
        "department": "Public Works Department",
        "queries": [
            "Provide certified copy of sanctioned budget for repair of Main Road.",
            "State official completion date and contractor name."
        ],
        "is_life_liberty": False,
        "is_bpl": False
    }
    resp = client.post("/actions/rti", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "RIGHT TO INFORMATION ACT, 2005" in data["application_text"]
    assert data["fee_amount"] == "Rs. 10/-"
    assert "30 Calendar Days" in data["timeline"]


def test_dlsa_guidance():
    resp = client.get("/actions/dlsa?district=noida&state=uttar pradesh")
    assert resp.status_code == 200
    data = resp.json()
    assert "Noida" in data["district"]
    assert data["national_legal_aid_tollfree"] == "15100"
    assert len(data["eligibility_criteria"]) > 0


def test_efir_guidance():
    payload = {
        "incident_type": "cyber financial fraud upi scam",
        "details": "Lost Rs 25,000 after scanning QR code sent on WhatsApp."
    }
    resp = client.post("/actions/efir", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data["eligible_for_efir"] is True
    assert "1930" in data["national_cyber_portal"]


def test_checklist():
    payload = {"issue_type": "tenancy"}
    resp = client.post("/actions/checklist", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["essential_documents"]) > 0
    assert "Rent Agreement" in str(data["essential_documents"])


def test_edit_draft():
    payload = {
        "draft_text": "Sir, You have delayed flat possession. Please refund my money within 15 days.",
        "instruction": "Make this notice more formal under Section 18 of RERA and mention statutory interest.",
        "lang": "en"
    }
    resp = client.post("/actions/edit-draft", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "revised_text" in data
    assert len(data["revised_text"]) > 10
    assert "explanation_of_changes" in data
    assert "diff_summary" in data

