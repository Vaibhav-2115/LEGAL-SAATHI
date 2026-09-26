"""
Tests for Phase 26: LoRA Model Integration into Main FastAPI Application.
Verifies health endpoint, /analyze-case root contract, /api/v1/lora routes,
and /lora/grounded-analyze RAG-to-model integration.
"""

from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_lora_health_endpoints():
    """Verifies both root /lora/health and versioned /api/v1/lora/health."""
    for path in ["/lora/health", "/api/v1/lora/health"]:
        response = client.get(path)
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "model_name" in data
        assert "adapter_name" in data
        assert "device" in data
        assert "lora_mounted" in data


def test_lora_analyze_case_root_contract():
    """
    Verifies backwards compatibility with standalone api_server.py:
    POST /analyze-case accepts case_text and returns structured analysis.
    """
    payload = {
        "case_text": (
            "State of Maharashtra vs Ramesh. The accused was found in possession of stolen jewellery "
            "worth Rs. 50,000 under Section 411 IPC. Search conducted under Section 100 CrPC."
        ),
        "max_new_tokens": 40,
        "temperature": 0.1
    }
    response = client.post("/analyze-case", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["core_dispute"]
    assert isinstance(data["relevant_laws"], list)
    assert any("411" in law or "IPC" in law for law in data["relevant_laws"])
    assert data["findings"]
    assert data["tokens_generated"] > 0
    assert data["generation_time_seconds"] > 0


def test_lora_analyze_case_scoped_endpoint():
    """Verifies the scoped endpoint /api/v1/lora/analyze-case."""
    payload = {
        "case_text": (
            "Punjab National Bank vs M/s Modern Mills. Cheque dishonour under Section 138 of the "
            "Negotiable Instruments Act, 1881. Statutory notice served within 30 days."
        ),
        "max_new_tokens": 40
    }
    response = client.post("/api/v1/lora/analyze-case", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert any("138" in law or "Negotiable Instruments" in law for law in data["relevant_laws"])


def test_lora_grounded_analyze_rag_pipeline():
    """
    Verifies Phase 24 -> Phase 26 integration:
    User Query -> Hybrid Retrieval -> Context Injection -> LoRA Inference -> Traceable Citations.
    """
    payload = {
        "case_text": "Consumer bought defective laptop. Company refusing refund or replacement under Consumer Protection Act.",
        "top_k": 2,
        "issue_type_filter": "consumer",
        "max_new_tokens": 40
    }
    response = client.post("/api/v1/lora/grounded-analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["core_dispute"]
    assert data["retrieval_count"] >= 1
    assert isinstance(data["citations"], list)
    assert data["confidence"] in ["strong", "partial", "insufficient"]


def test_lora_input_validation():
    """Verifies input length validation on LoRA endpoints."""
    # Text too short (< 10 chars)
    response = client.post("/analyze-case", json={"case_text": "short"})
    assert response.status_code == 422
