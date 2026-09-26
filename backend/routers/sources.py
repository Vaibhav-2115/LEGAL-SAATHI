"""
Legal Saathi - Sources Router (sources.py)
Endpoint GET /sources/{id}: Full statutory detail for a citation card.
"""

from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Query, status
from backend.schemas.retrieval import SourceDetail
from backend.services.retrieval_service import retrieval_service

router = APIRouter(tags=["Sources"])


@router.get("/sources")
def list_sources(
    query: Optional[str] = Query(default=None, description="Search term for title, section, or text"),
    category: Optional[str] = Query(default=None, description="Category filter (ACTS, JUDGMENTS, RULES, SECTIONS, OTHER_VERIFIED_SOURCES)"),
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0)
):
    """
    Lists and searches across verified Indian legal sources in the active knowledge base.
    """
    return retrieval_service.list_sources(
        query=query,
        category=category,
        limit=limit,
        offset=offset
    )


@router.get("/sources/{source_id}", response_model=SourceDetail)
def get_source_detail(source_id: str):
    """
    Fetches official statutory section text, jurisdiction, and official links
    for a citation source.
    """
    detail = retrieval_service.get_source_detail(source_id)
    if not detail:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"error": "source_not_found", "message": f"Legal source '{source_id}' was not found."}
        )
    return detail
