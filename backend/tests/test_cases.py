"""Tests for /cases endpoints."""
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_create_and_get_case():
    session_id = "test_sess_001"
    headers = {"X-Session-ID": session_id}

    # 1. Create Case
    create_payload = {
        "session_id": session_id,
        "issue_type": "tenancy",
        "title": "Dispute with Landlord Sharma in Noida",
        "description": "Landlord deducted 50000 rupees security deposit without any repair receipts.",
        "entities": {
            "opposing_party": "Landlord Sharma",
            "location": "Noida",
            "amount": 50000
        }
    }
    create_resp = client.post("/cases", json=create_payload, headers=headers)
    assert create_resp.status_code == 200
    case_data = create_resp.json()
    case_id = case_data["case_id"]
    assert case_id.startswith("case_")
    assert case_data["entities"]["locality_bucket"] == "Noida / Greater Noida (UP)"
    assert case_data["entities"]["amount_bucket"] == "₹25,000–₹1,00,000"

    # 2. Get Case by ID
    get_resp = client.get(f"/cases/{case_id}", headers=headers)
    assert get_resp.status_code == 200
    assert get_resp.json()["case_id"] == case_id

    # 3. Patch Case
    patch_payload = {
        "title": "Updated Dispute with Landlord Sharma",
        "consent_status": "granted"
    }
    patch_resp = client.patch(f"/cases/{case_id}", json=patch_payload, headers=headers)
    assert patch_resp.status_code == 200
    assert patch_resp.json()["title"] == "Updated Dispute with Landlord Sharma"
    assert patch_resp.json()["consent_status"] == "granted"

    # 4. List Cases
    list_resp = client.get("/cases", headers=headers)
    assert list_resp.status_code == 200
    assert len(list_resp.json()) >= 1
