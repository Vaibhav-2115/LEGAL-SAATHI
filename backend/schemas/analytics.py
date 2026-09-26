"""
Legal Saathi - Analytics Schemas
Defines schemas for aggregate non-PII platform metrics.
"""

from typing import Any, Dict, List
from pydantic import BaseModel


class AnalyticsSummaryResponse(BaseModel):
    total_sessions: int
    total_cases: int
    counts_by_issue_type: Dict[str, int]
    confidence_distribution: Dict[str, int]
    cluster_count: int
    total_clustered_incidents: int
    common_localities: List[Dict[str, Any]]
