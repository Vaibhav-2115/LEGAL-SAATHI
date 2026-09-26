"""
Legal Saathi - Sources Router (sources.py)
Endpoint GET /sources/{id}: Full statutory detail for a citation card.
"""

from fastapi import APIRouter, HTTPException, status
from backend.schemas.retrieval import SourceDetail
from backend.services.retrieval_service import retrieval_service

router = APIRouter(tags=["Sources"])


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
