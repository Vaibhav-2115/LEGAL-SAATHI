"""
Legal Saathi - Analytics Router (analytics.py)
Endpoint GET /analytics/summary: Aggregated, privacy-preserving usage and issue statistics.
Per Section 12 of the Technical Blueprint.
"""

from fastapi import APIRouter
from backend.data.db import db
from backend.schemas.analytics import AnalyticsSummaryResponse

router = APIRouter(tags=["Analytics"])


@router.get("/analytics/summary", response_model=AnalyticsSummaryResponse)
def get_analytics_summary():
    """
    Returns aggregate, non-PII usage statistics, case distributions,
    and collective cluster counts.
    """
    stats = db.get_analytics_summary()
    return AnalyticsSummaryResponse(**stats)
