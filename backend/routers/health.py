"""
Legal Saathi - Health Router (health.py)
Provides liveness and readiness probes for infrastructure and monitoring.
"""

from datetime import datetime, timezone
from fastapi import APIRouter
from backend.core.config import settings
from backend.data.db import db
from backend.services.retrieval_service import retrieval_service

router = APIRouter(tags=["Health"])


@router.get("/health")
def health_check():
    """Liveness & readiness probe."""
    try:
        # Check DB connectivity
        conn = db.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    corpus_chunks_count = len(retrieval_service.documents)

    return {
        "status": "healthy" if db_status == "healthy" else "degraded",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "database": db_status,
        "corpus_loaded_chunks": corpus_chunks_count,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
