"""Tests for /retrieval/search and /sources/{id} endpoints."""
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_search_consumer_act():
    response = client.post("/retrieval/search", json={"query": "deficiency in service refund consumer", "top_k": 3})
    assert response.status_code == 200
    data = response.json()
    assert data["total_found"] > 0
    first_chunk = data["chunks"][0]
    assert "cpa" in first_chunk["source_id"].lower() or "consumer" in first_chunk["title"].lower()
    assert first_chunk["score"] > 0


def test_get_source_detail():
    response = client.get("/sources/src_cpa_2019_sec2_11")
    assert response.status_code == 200
    data = response.json()
    assert data["section_ref"] == "Section 2(11)"
    assert "deficiency" in data["full_text"].lower()


def test_get_missing_source():
    response = client.get("/sources/non_existent_source_999")
    assert response.status_code == 404
