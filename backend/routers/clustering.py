"""
Legal Saathi - Clustering Router (clustering.py)
Endpoint POST /clustering/run: Triggers cross-user cluster detection across consented incidents.
Per Section 8 & 12 of the Technical Blueprint.
"""

from typing import List
from fastapi import APIRouter, Depends
from backend.data.db import db
from backend.safety.rate_limiter import rate_limit_dependency
from backend.schemas.clustering import ClusterGroup, ClusterRunRequest, ClusterRunResponse
from backend.services.engine.clustering import engine

router = APIRouter(tags=["Clustering"])


@router.post("/clustering/run", response_model=ClusterRunResponse, dependencies=[Depends(rate_limit_dependency)])
def trigger_clustering(payload: ClusterRunRequest):

    """
    Executes unsupervised similarity clustering across all consented incident records.
    Produces explained cluster groups for collective legal action.
    """
    res = engine.run_clustering(
        scope=payload.scope or "all",
        min_similarity=payload.min_similarity,
        min_cluster_size=payload.min_cluster_size
    )
    return res


@router.get("/clustering/list", response_model=List[ClusterGroup])
def list_active_clusters():
    """Returns all currently active legal action clusters."""
    raw_clusters = db.list_clusters()
    return [
        ClusterGroup(
            cluster_id=c["cluster_id"],
            issue_type=c["issue_type"],
            locality_bucket=c["locality_bucket"],
            explanation_text=c["explanation_text"],
            member_count=c["member_count"],
            incident_ids=c.get("incident_ids", []),
            created_at=c["created_at"],
            status=c.get("status", "active")
        )
        for c in raw_clusters
    ]
