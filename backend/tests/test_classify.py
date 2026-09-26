"""Tests for /classify endpoint."""
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_classify_consumer_issue():
    response = client.post("/classify", json={"text": "I bought a laptop from an online store and it arrived defective. The seller refused a refund."})
    assert response.status_code == 200
    data = response.json()
    assert data["issue_type"] == "consumer"
    assert data["is_emergency"] is False
    assert len(data["applicable_acts"]) > 0


def test_classify_rera_delay():
    response = client.post("/classify", json={"text": "The builder delayed possession of my flat by 2 years and is not paying interest under RERA."})
    assert response.status_code == 200
    data = response.json()
    assert data["issue_type"] == "property_rera"
    assert "Real Estate" in data["applicable_acts"][0]


def test_classify_tenancy():
    response = client.post("/classify", json={"text": "My landlord cut my electricity supply and is refusing to return my security deposit."})
    assert response.status_code == 200
    data = response.json()
    assert data["issue_type"] == "tenancy"


def test_classify_emergency():
    response = client.post("/classify", json={"text": "Help me my husband is beating me right now in the house please send police."})
    assert response.status_code == 200
    data = response.json()
    assert data["is_emergency"] is True
    assert data["urgency"] == "emergency"
    assert "181" in data["emergency_helpline"] or "112" in data["emergency_helpline"]
