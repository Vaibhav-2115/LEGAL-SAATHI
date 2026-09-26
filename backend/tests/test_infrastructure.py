"""
Legal Saathi - Phase 27 Infrastructure Tests
Tests liveness probe (/healthz), readiness probe (/readyz), correlation ID middleware,
and environment/configuration startup validation.
"""

from fastapi.testclient import TestClient
from backend.main import app
from backend.core.config import settings

client = TestClient(app)


def test_liveness_probe_healthz():
    """Verify /healthz returns 200 OK with alive status."""
    response = client.get("/healthz")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "alive"
    assert "timestamp" in data


def test_readiness_probe_readyz():
    """Verify /readyz returns 200 and reports database and retrieval readiness."""
    response = client.get("/readyz")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "database_connected" in data
    assert "retrieval_ready" in data
    assert data["retrieval_ready"] is True


def test_correlation_id_middleware():
    """Verify X-Request-ID header is generated and returned on all responses."""
    # 1. Without client header -> auto-generated
    resp1 = client.get("/healthz")
    assert resp1.status_code == 200
    req_id = resp1.headers.get("X-Request-ID")
    assert req_id is not None
    assert req_id.startswith("req-")

    # 2. With client header -> preserved
    custom_id = "test-custom-trace-9999"
    resp2 = client.get("/healthz", headers={"X-Request-ID": custom_id})
    assert resp2.headers.get("X-Request-ID") == custom_id


def test_scoped_health_probes():
    """Verify /api/v1/healthz and /api/v1/readyz work under scoped prefix."""
    resp1 = client.get("/api/v1/healthz")
    assert resp1.status_code == 200
    assert resp1.json()["status"] == "alive"

    resp2 = client.get("/api/v1/readyz")
    assert resp2.status_code == 200
    assert "status" in resp2.json()


def test_production_environment_settings():
    """Verify required configuration keys are defined in settings."""
    assert hasattr(settings, "PROJECT_NAME")
    assert hasattr(settings, "VERSION")
    assert hasattr(settings, "CORS_ORIGINS")
    assert hasattr(settings, "RATE_LIMIT_REQUESTS_PER_MINUTE")
    assert hasattr(settings, "MAX_AUDIO_UPLOAD_BYTES")
