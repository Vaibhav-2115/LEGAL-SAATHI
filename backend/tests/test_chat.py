"""Tests for /chat pipeline endpoint."""
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_chat_consumer_query():
    payload = {
        "text": "The electronics company delivered a broken refrigerator and customer care is refusing a refund or repair.",
        "lang": "en"
    }
    response = client.post("/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert len(data["answer"]) > 50
    assert data["confidence"] in ("strong", "partial")
    assert len(data["citations"]) > 0
    assert data["suggested_action"]["type"] in ("notice", "checklist")
    assert data["issue_type"] == "consumer"
    assert data["session_id"] is not None
    assert data["case_id"] is not None


def test_chat_emergency_query():
    payload = {
        "text": "My husband has locked me in a room and is threatening physical violence right now help!",
        "lang": "en"
    }
    response = client.post("/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["urgency"] == "emergency"
    assert "SAFETY ALERT" in data["answer"]
    assert "181" in data["answer"] or "112" in data["answer"]
