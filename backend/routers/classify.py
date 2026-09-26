"""
Legal Saathi - Classify Router (classify.py)
Endpoint POST /classify: Classifies legal issue taxonomy and assesses urgency.
"""

from fastapi import APIRouter, HTTPException, status
from backend.safety.input_validation import validate_text_input
from backend.schemas.classify import ClassifyRequest, ClassifyResponse
from backend.services.classifier import classifier

router = APIRouter(tags=["Classification"])


@router.post("/classify", response_model=ClassifyResponse)
def classify_endpoint(payload: ClassifyRequest):
    """
    Classifies legal issue type, urgency level, and applicable Indian Acts.
    """
    clean_text = validate_text_input(payload.text, field_name="text")
    result = classifier.classify(clean_text, lang=payload.lang or "en")
    return result
