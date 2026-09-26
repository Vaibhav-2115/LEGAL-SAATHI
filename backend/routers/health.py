"""
Legal Saathi - Health Router
Liveness and readiness probes for infrastructure monitoring.
"""

from datetime import datetime, timezone
from fastapi import APIRouter
from backend.core.config import settings
from backend.data.db import db
from backend.services.retrieval_service import retrieval_service

router = APIRouter(tags=["Health"])


@router.get("/health")
def health_check():
    """Liveness & readiness probe: verifies PostgreSQL connectivity and RAG status."""
    db_health = db.check_health()
    corpus_chunks_count = len(retrieval_service.documents)

    overall_status = "healthy" if db_health.get("status") == "healthy" else "degraded"

    return {
        "status": overall_status,
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "database": db_health.get("status", "unknown"),
        "database_engine": db_health.get("engine", "unknown"),
        "configured_engine": db_health.get("configured_engine", "postgresql"),
        "is_fallback": False,  # SQLite fallback removed; no fallback exists
        "database_target": db_health.get("database_target", "supabase_postgresql"),
        "corpus_loaded_chunks": corpus_chunks_count,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@router.get("/healthz")
def liveness_probe():
    """Kubernetes / Cloud Run liveness probe. Fast 200 OK indicating process is alive."""
    return {"status": "alive", "timestamp": datetime.now(timezone.utc).isoformat()}


@router.get("/readyz")
def readiness_probe():
    """Kubernetes / Cloud Run readiness probe. Verifies database and retrieval availability."""
    db_health = db.check_health()
    is_ready = db_health.get("status") == "healthy" and len(retrieval_service.documents) > 0
    return {
        "status": "ready" if is_ready else "not_ready",
        "database_connected": db_health.get("status") == "healthy",
        "retrieval_ready": len(retrieval_service.documents) > 0,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

