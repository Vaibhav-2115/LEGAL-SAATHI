"""
Legal Saathi - Supabase JWT & Role Authorization Unit Tests
"""

import base64
import hashlib
import hmac
import json
import time
import pytest
from fastapi import HTTPException
from backend.core.auth import verify_supabase_jwt, get_current_user, require_role
from backend.core.config import settings


def _create_test_jwt(sub="usr_test_123", email="test@example.com", role="CITIZEN", exp_offset=3600, secret=None):
    if secret is None:
        secret = settings.SECRET_KEY
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {
        "sub": sub,
        "email": email,
        "role": role,
        "exp": int(time.time()) + exp_offset
    }
    h_b64 = base64.urlsafe_b64encode(json.dumps(header).encode()).decode().rstrip("=")
    p_b64 = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip("=")
    sig = base64.urlsafe_b64encode(
        hmac.new(secret.encode(), f"{h_b64}.{p_b64}".encode(), hashlib.sha256).digest()
    ).decode().rstrip("=")
    return f"{h_b64}.{p_b64}.{sig}"


def test_valid_supabase_jwt_verification():
    token = _create_test_jwt(sub="user_rajesh", email="rajesh@example.com", role="CITIZEN")
    payload = verify_supabase_jwt(token)
    assert payload["sub"] == "user_rajesh"
    assert payload["email"] == "rajesh@example.com"
    assert payload["role"] == "CITIZEN"


def test_expired_jwt_rejection():
    token = _create_test_jwt(exp_offset=-10) # expired 10s ago
    with pytest.raises(HTTPException) as exc_info:
        verify_supabase_jwt(token)
    assert exc_info.value.status_code == 401
    assert exc_info.value.detail["error"] == "token_expired"


def test_tampered_signature_rejection():
    token = _create_test_jwt()
    tampered = token[:-4] + "xxxx"
    with pytest.raises(HTTPException) as exc_info:
        verify_supabase_jwt(tampered)
    assert exc_info.value.status_code == 401
    assert exc_info.value.detail["error"] == "invalid_signature"


def test_get_current_user_with_bearer_token():
    token = _create_test_jwt(sub="adv_vikram", role="LEGAL_AID_ADVOCATE")
    user = get_current_user(authorization=f"Bearer {token}")
    assert user["is_authenticated"] is True
    assert user["id"] == "adv_vikram"
    assert user["role"] == "LEGAL_AID_ADVOCATE"


def test_get_current_user_fallback_session():
    user = get_current_user(authorization=None, x_session_id="sess_custom_abc")
    assert user["is_authenticated"] is False
    assert user["session_id"] == "sess_custom_abc"


def test_role_authorization_enforcement():
    citizen_user = {"id": "usr_1", "role": "CITIZEN"}
    advocate_user = {"id": "usr_2", "role": "LEGAL_AID_ADVOCATE"}

    advocate_only = require_role(["LEGAL_AID_ADVOCATE", "DLSA_OFFICER"])
    assert advocate_only(advocate_user)["id"] == "usr_2"

    with pytest.raises(HTTPException) as exc_info:
        advocate_only(citizen_user)
    assert exc_info.value.status_code == 403
    assert exc_info.value.detail["error"] == "insufficient_permissions"
