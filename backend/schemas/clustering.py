"""
Legal Saathi - Clustering Schemas
Defines schemas for batch or on-demand cluster formation (POST /clustering/run).
"""

from typing import List, Optional
from pydantic import BaseModel, Field


class ClusterRunRequest(BaseModel):
    scope: Optional[str] = Field(default="all", description="all | tenancy | consumer | property_rera")
    min_similarity: float = Field(default=0.75, ge=0.5, le=1.0)
    min_cluster_size: int = Field(default=2, ge=2)


class ClusterGroup(BaseModel):
    cluster_id: str
    issue_type: str
    locality_bucket: str
    explanation_text: str
    member_count: int
    incident_ids: List[str]
    created_at: str
    status: str = "active"


class ClusterRunResponse(BaseModel):
    clusters: List[ClusterGroup]
    total_clusters: int
    clustered_incidents_count: int
    timestamp: str
