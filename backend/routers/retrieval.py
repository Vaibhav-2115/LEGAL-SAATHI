"""
Legal Saathi - Retrieval Router (retrieval.py)
Endpoint POST /retrieval/search: Direct hybrid search over Indian legal corpus.
"""

from fastapi import APIRouter
from backend.safety.input_validation import validate_text_input
from backend.schemas.retrieval import SearchRequest, SearchResponse
from backend.services.retrieval_service import retrieval_service

router = APIRouter(tags=["Retrieval"])


@router.post("/retrieval/search", response_model=SearchResponse)
def search_corpus(payload: SearchRequest):
    """
    Directly queries the hybrid retrieval engine (BM25 + Vector + RRF)
    over Acts and Judgments.
    """
    clean_query = validate_text_input(payload.query, field_name="query")
    chunks = retrieval_service.search(
        query=clean_query,
        corpus=payload.corpus,
        top_k=payload.top_k,
        issue_type_filter=payload.issue_type_filter
    )
    return SearchResponse(
        chunks=chunks,
        total_found=len(chunks),
        query=clean_query,
        corpus=payload.corpus
    )
