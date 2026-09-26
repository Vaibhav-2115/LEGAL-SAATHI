"""
Legal Saathi - Retrieval Schemas
Matches POST /retrieval/search and GET /sources/{id}
"""

from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field


class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=2000, description="Search query or legal problem statement")
    corpus: Literal["acts", "judgments", "incidents", "all"] = Field(
        default="acts",
        description="Target corpus to search"
    )
    top_k: int = Field(default=5, ge=1, le=20)
    issue_type_filter: Optional[str] = Field(default=None, max_length=50)



class ChunkItem(BaseModel):
    chunk_id: str
    text: str
    source_id: str
    title: str
    section_ref: str
    jurisdiction: str = "India (Central)"
    date: Optional[str] = None
    type: str = "Act"  # Act | Judgment | Incident
    score: float = Field(..., description="Hybrid RRF relevance score")
    metadata: Dict[str, Any] = Field(default_factory=dict)


class SearchResponse(BaseModel):
    chunks: List[ChunkItem]
    total_found: int
    query: str
    corpus: str


class SourceDetail(BaseModel):
    source_id: str
    title: str
    section_ref: str
    jurisdiction: str
    type: str
    date: Optional[str] = None
    full_text: str
    official_link: Optional[str] = None
    summary: Optional[str] = None
