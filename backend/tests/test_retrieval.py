"""Tests for /retrieval/search and /sources/{id} endpoints (Phase 24)."""
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_search_consumer_act():
    """Verifies English lexical + semantic hybrid search over Consumer Protection Act."""
    response = client.post("/retrieval/search", json={"query": "deficiency in service refund consumer", "top_k": 3})
    assert response.status_code == 200
    data = response.json()
    assert data["total_found"] > 0
    first_chunk = data["chunks"][0]
    assert "cpa" in first_chunk["source_id"].lower() or "consumer" in first_chunk["title"].lower()
    assert first_chunk["score"] > 0


def test_search_hindi_query():
    """Verifies cross-lingual Devanagari Hindi search over Indian legal corpus."""
    response = client.post("/retrieval/search", json={"query": "उपभोक्ता संरक्षण 2019", "top_k": 3})
    assert response.status_code == 200
    data = response.json()
    assert data["total_found"] > 0
    titles = [c["title"].lower() for c in data["chunks"]]
    assert any("consumer" in t for t in titles)


def test_search_hindi_tenancy_query():
    """Verifies Hindi query expansion for tenancy & rent disputes."""
    response = client.post("/retrieval/search", json={"query": "मकानमालिक किराया और सिक्योरिटी डिपॉजिट", "top_k": 3})
    assert response.status_code == 200
    data = response.json()
    assert data["total_found"] > 0
    titles = [c["title"].lower() for c in data["chunks"]]
    assert any("tenancy" in t or "property" in t for t in titles)


def test_search_all_corpus():
    """Verifies flexible corpus filtering across Acts and Judgments."""
    response = client.post("/retrieval/search", json={"query": "right to information appeal", "corpus": "all", "top_k": 5})
    assert response.status_code == 200
    data = response.json()
    assert data["total_found"] > 0


def test_get_source_detail():
    """Verifies statutory source lookup for citation card drilldown."""
    response = client.get("/sources/src_cpa_2019_sec2_11")
    assert response.status_code == 200
    data = response.json()
    assert data["section_ref"] == "Section 2(11)"
    assert "deficiency" in data["full_text"].lower()


def test_get_missing_source():
    """Verifies 404 response on non-existent legal source."""
    response = client.get("/sources/non_existent_source_999")
    assert response.status_code == 404
