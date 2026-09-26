"""
Legal Saathi - Entitlement & Access Gatekeeper (entitlements.py)
Implements Section 5 of LEGAL_SAATHI_REVENUE_BACKEND_SPEC.md.
Provides role and feature-based entitlement checking, gating premium actions
while maintaining 100% free access for Civic legal guidance & DLSA legal aid.
"""

from typing import Any, Callable, Dict, Optional
from fastapi import Depends, HTTPException, status
from backend.core.auth import get_current_session
from backend.data.db import db
from backend.core.logging import logger


def get_user_id_from_session(session_id: str) -> str:
    """Resolves or provisions a persistent user_id for the given session_id."""
    session_data = db.get_or_create_session(session_id)
    return session_data.get("user_id") or f"usr_{session_id}"


def get_user_entitlements(user_id: str) -> Dict[str, Any]:
    """
    Returns an entitlement summary for the user.
    Civic tier is free forever. Pro/Advocate tier grants full automation.
    """
    is_pro = db.check_user_has_active_pro(user_id)
    sub = db.get_user_subscription(user_id)
    tier = sub.get("plan_tier", "civic") if (sub and is_pro) else "civic"

    return {
        "user_id": user_id,
        "tier": tier,
        "is_pro": is_pro,
        "can_access_civic_chat": True,      # Always 100% free under Article 39A
        "can_access_dlsa": True,            # Always 100% free under LSAA 1987
        "can_generate_checklist": True,     # Free rights literacy
        "can_draft_notice": is_pro or db.check_user_has_unlocked_item(user_id, "notice_draft"),
        "can_draft_rti": is_pro or db.check_user_has_unlocked_item(user_id, "rti_draft"),
        "can_draft_efir": is_pro or db.check_user_has_unlocked_item(user_id, "efir_draft"),
        "can_export_pdf_dossier": is_pro,
        "can_join_collective_dockets": is_pro or db.check_user_has_unlocked_item(user_id, "collective_docket")
    }


def require_entitlement(required_feature: str):
    """
    FastAPI Dependency to gate premium features.
    Usage:
        @router.post("/actions/notice/pdf", dependencies=[Depends(require_entitlement("notice_draft"))])
    """
    async def dependency(session_id: str = Depends(get_current_session)) -> bool:
        user_id = get_user_id_from_session(session_id)

        # 1. Check if user has active Saathi Pro or Advocate subscription
        if db.check_user_has_active_pro(user_id):
            return True

        # 2. Check if user made a one-off payment for this specific feature/item
        if db.check_user_has_unlocked_item(user_id, required_feature):
            return True

        # 3. Paywall error contract matching blueprint specification
        feature_labels = {
            "notice_draft": ("Formal Legal Notice Generation", 199),
            "rti_draft": ("Section 6(1) RTI Application Packet", 199),
            "efir_draft": ("Formal Cyber e-FIR Complaint Dossier", 199),
            "collective_docket": ("Collective Action Docket Escrow", 499),
            "pdf_export": ("Watermark-Free Legal PDF Export", 149)
        }
        title, price = feature_labels.get(required_feature, (required_feature.replace("_", " ").title(), 199))

        logger.info(f"Payment required for user {user_id} accessing feature '{required_feature}'")
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail={
                "error": "PAYMENT_REQUIRED",
                "message": (
                    f"{title} requires an active Saathi Pro subscription (₹149/mo) "
                    f"or a one-time single draft unlock (₹{price})."
                ),
                "feature": required_feature,
                "price_inr": price,
                "checkout_url": "/api/v1/billing/checkout"
            }
        )

    return dependency
