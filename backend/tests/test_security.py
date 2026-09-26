"""
Legal Saathi - Comprehensive Security Test Suite (test_security.py)
Tests IDOR defense, session boundary enforcement, SSRF guards, file upload security,
security headers, rate limiting, and input validation bounds.
"""

import io
from fastapi.testclient import TestClient
from backend.main import app
from backend.safety.rate_limiter import check_rate_limit, _request_history
from backend.services.voice_service import is_safe_public_url

client = TestClient(app)


def test_case_ownership_idor_prevention():
    """SEC-002: Verifies that Session B cannot view, patch, or delete Session A's case."""
    session_a = "session_citizen_alice_123"
    session_b = "session_attacker_bob_456"

    # 1. Citizen Alice creates a case
    create_payload = {
        "issue_type": "consumer",
        "title": "Alice Defective Laptop Grievance",
        "description": "Purchased laptop with defective motherboard; retailer refusing replacement.",
        "entities": {
            "opposing_party": "MegaElectronics Store",
            "location": "Bengaluru",
            "amount": 75000
        }
    }
    create_resp = client.post("/cases", json=create_payload, headers={"X-Session-ID": session_a})
    assert create_resp.status_code == 200
    case_id = create_resp.json()["case_id"]

    # 2. Attacker Bob tries to view Alice's case by ID (IDOR attack)
    idor_get = client.get(f"/cases/{case_id}", headers={"X-Session-ID": session_b})
    assert idor_get.status_code == 403
    assert idor_get.json()["detail"]["error"] == "forbidden"

    # 3. Attacker Bob tries to PATCH Alice's case
    idor_patch = client.patch(
        f"/cases/{case_id}",
        json={"title": "Hacked Title by Bob"},
        headers={"X-Session-ID": session_b}
    )
    assert idor_patch.status_code == 403
    assert idor_patch.json()["detail"]["error"] == "forbidden"

    # 4. Attacker Bob tries to DELETE Alice's case
    idor_delete = client.delete(f"/cases/{case_id}", headers={"X-Session-ID": session_b})
    assert idor_delete.status_code == 403
    assert idor_delete.json()["detail"]["error"] == "forbidden"

    # 5. Alice can view her own case
    alice_get = client.get(f"/cases/{case_id}", headers={"X-Session-ID": session_a})
    assert alice_get.status_code == 200
    assert alice_get.json()["title"] == "Alice Defective Laptop Grievance"


def test_incident_submission_ownership_and_consent():
    """SEC-002 / SEC-008: Verifies cross-session incident submission and consent requirement."""
    session_a = "session_citizen_consent_a"
    session_b = "session_citizen_consent_b"

    # Create case under Session A
    create_resp = client.post(
        "/cases",
        json={"issue_type": "tenancy", "title": "Deposit issue", "description": "Deposit withheld"},
        headers={"X-Session-ID": session_a}
    )
    case_id = create_resp.json()["case_id"]

    # 1. Attempt to submit incident without consent flag
    no_consent_resp = client.post(
        "/incidents",
        json={"case_id": case_id, "consent_flag": False},
        headers={"X-Session-ID": session_a}
    )
    assert no_consent_resp.status_code == 400
    assert no_consent_resp.json()["detail"]["error"] == "consent_required"

    # 2. Session B tries to submit incident for Session A's case
    unauthorized_resp = client.post(
        "/incidents",
        json={"case_id": case_id, "consent_flag": True},
        headers={"X-Session-ID": session_b}
    )
    assert unauthorized_resp.status_code == 403
    assert unauthorized_resp.json()["detail"]["error"] == "forbidden"

    # 3. Session A submits with informed consent -> Success
    valid_resp = client.post(
        "/incidents",
        json={"case_id": case_id, "consent_flag": True},
        headers={"X-Session-ID": session_a}
    )
    assert valid_resp.status_code == 200
    assert valid_resp.json()["case_id"] == case_id


def test_malformed_session_id_rejected():
    """SEC-001: Verifies rejection of header injection and path traversal session IDs."""
    malformed_sessions = [
        "../../etc/passwd",
        "sess with spaces",
        "sess;SELECT * FROM cases",
        "a" * 65  # exceeds 64 chars
    ]
    for bad_sess in malformed_sessions:
        resp = client.get("/cases", headers={"X-Session-ID": bad_sess})
        assert resp.status_code == 400
        assert resp.json()["detail"]["error"] == "invalid_session_id"


def test_action_case_id_ownership():
    """SEC-002: Verifies that action endpoints reject unauthorized case_ids."""
    session_a = "session_actions_owner"
    session_b = "session_actions_intruder"

    create_resp = client.post(
        "/cases",
        json={"issue_type": "consumer", "title": "Action Test Case"},
        headers={"X-Session-ID": session_a}
    )
    case_id = create_resp.json()["case_id"]

    # Session B tries to generate notice referencing Session A's case
    notice_resp = client.post(
        "/actions/notice",
        json={
            "case_id": case_id,
            "sender_name": "Bob",
            "sender_address": "Street B",
            "recipient_name": "Store",
            "recipient_address": "Street S",
            "subject": "Notice"
        },
        headers={"X-Session-ID": session_b}
    )
    assert notice_resp.status_code == 403
    assert notice_resp.json()["detail"]["error"] == "forbidden"


def test_ssrf_prevention():
    """SEC-007: Verifies SSRF guard blocks internal, private, and metadata IP URLs."""
    blocked_urls = [
        "http://127.0.0.1:8000/internal",
        "http://localhost:3000/secret",
        "http://169.254.169.254/latest/meta-data/",
        "http://0.0.0.0:8000/",
        "ftp://external.com/audio.wav",
        "file:///etc/passwd"
    ]
    for url in blocked_urls:
        is_safe, reason = is_safe_public_url(url)
        assert is_safe is False, f"URL {url} should have been blocked: {reason}"


def test_voice_upload_extension_and_size_validation():
    """SEC-004: Verifies file upload validation against unauthorized types and empty files."""
    # 1. Unauthorized extension (e.g. .sh, .py, .exe)
    fake_script = io.BytesIO(b"echo 'malicious script'")
    resp_script = client.post(
        "/voice/stt/upload",
        files={"file": ("exploit.sh", fake_script, "application/x-sh")}
    )
    assert resp_script.status_code == 400
    assert resp_script.json()["detail"]["error"] == "unsupported_media_type"

    # 2. Empty file
    empty_file = io.BytesIO(b"")
    resp_empty = client.post(
        "/voice/stt/upload",
        files={"file": ("recording.wav", empty_file, "audio/wav")}
    )
    assert resp_empty.status_code == 400
    assert resp_empty.json()["detail"]["error"] == "empty_file"


def test_security_headers_present():
    """SEC-010: Verifies standard HTTP security headers are attached to responses."""
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.headers.get("X-Content-Type-Options") == "nosniff"
    assert resp.headers.get("X-Frame-Options") == "DENY"
    assert resp.headers.get("X-XSS-Protection") == "1; mode=block"
    assert resp.headers.get("Referrer-Policy") == "strict-origin-when-cross-origin"
    assert "microphone=(self)" in resp.headers.get("Permissions-Policy", "")


def test_rate_limiter_blocks_abuse():
    """SEC-005: Verifies rate limiter triggers 429 when threshold exceeded."""
    test_key = "test_rate_flood_session"
    _request_history[test_key].clear()

    # Max requests is set to 5 for test key
    for _ in range(5):
        check_rate_limit(key=test_key, max_requests=5, window_seconds=60)

    # 6th request must raise 429
    import pytest
    from fastapi import HTTPException
    with pytest.raises(HTTPException) as exc_info:
        check_rate_limit(key=test_key, max_requests=5, window_seconds=60)
    assert exc_info.value.status_code == 429
    assert exc_info.value.detail["error"] == "rate_limit_exceeded"
