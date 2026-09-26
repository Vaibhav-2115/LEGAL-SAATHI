"""
Legal Saathi - Indian Legal LLaMA LoRA Router (lora.py)
Unified backend router integrating the fine-tuned PEFT LoRA adapter
into the primary FastAPI application.
Exposes root and versioned endpoints matching both api_server.py and enterprise RAG contracts.
"""

from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from backend.core.logging import logger
from backend.schemas.chat import Citation
from backend.services.citation_service import citation_service
from backend.services.retrieval_service import retrieval_service

router = APIRouter(tags=["Legal AI - LoRA"])

# Lazy reference to IndianLegalModelRunner
_runner_instance = None


def get_model_runner():
    """Lazy loader for IndianLegalModelRunner to avoid blocking application startup."""
    global _runner_instance
    if _runner_instance is None:
        try:
            from model_runner import IndianLegalModelRunner
            _runner_instance = IndianLegalModelRunner.get_instance()
        except Exception as e:
            logger.error(f"Failed to initialize IndianLegalModelRunner: {e}")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"LoRA model runner is currently unavailable: {str(e)}"
            )
    return _runner_instance


# ---------------------------------------------------------
# Schemas matching api_server.py and grounded inference
# ---------------------------------------------------------

class CaseAnalysisRequest(BaseModel):
    case_text: str = Field(
        ...,
        min_length=10,
        description="Indian legal case excerpt, FIR description, or judgment snippet.",
        examples=[
            "State of Maharashtra vs Ramesh. The accused was found in possession of stolen property under Section 411 IPC."
        ],
    )
    max_new_tokens: Optional[int] = Field(
        default=128,
        ge=16,
        le=512,
        description="Maximum number of tokens to generate.",
    )
    temperature: Optional[float] = Field(
        default=0.2,
        ge=0.0,
        le=1.0,
        description="Sampling temperature (lower = more deterministic statutory citations).",
    )
    top_p: Optional[float] = Field(
        default=0.9,
        ge=0.0,
        le=1.0,
        description="Nucleus sampling probability.",
    )


class CaseAnalysisResponse(BaseModel):
    status: str
    core_dispute: str
    relevant_laws: List[str]
    findings: str
    raw_output: str
    device_used: str
    generation_time_seconds: float
    tokens_generated: int


class GroundedCaseAnalysisRequest(BaseModel):
    case_text: str = Field(..., min_length=10, description="Legal case description or citizen dispute facts.")
    top_k: Optional[int] = Field(default=3, ge=1, le=10)
    issue_type_filter: Optional[str] = Field(default=None)
    max_new_tokens: Optional[int] = Field(default=128, ge=16, le=512)


class GroundedCaseAnalysisResponse(BaseModel):
    status: str
    core_dispute: str
    relevant_laws: List[str]
    findings: str
    citations: List[Citation]
    confidence: str
    retrieval_count: int
    device_used: str
    generation_time_seconds: float


class HealthResponse(BaseModel):
    status: str
    model_name: str
    adapter_name: str
    device: str
    is_ready: bool
    lora_mounted: bool


# ---------------------------------------------------------
# Endpoints
# ---------------------------------------------------------

@router.get("/lora/health", response_model=HealthResponse, summary="LoRA Model Health Check")
def lora_health():
    """Verifies that the LoRA adapter and base model are ready for inference."""
    try:
        from model_runner import IndianLegalModelRunner, DEFAULT_BASE_MODEL, DEFAULT_ADAPTER_DIR
        if IndianLegalModelRunner._instance is not None and IndianLegalModelRunner._instance.is_ready:
            inst = IndianLegalModelRunner._instance
            return HealthResponse(
                status="ready",
                model_name=inst.base_model_name,
                adapter_name=inst.adapter_path.name,
                device=inst.device,
                is_ready=True,
                lora_mounted=True,
            )
        return HealthResponse(
            status="standby",
            model_name=DEFAULT_BASE_MODEL,
            adapter_name=DEFAULT_ADAPTER_DIR.name,
            device="cpu",
            is_ready=False,
            lora_mounted=False,
        )
    except Exception as e:
        return HealthResponse(
            status="error",
            model_name="unknown",
            adapter_name="unknown",
            device="unknown",
            is_ready=False,
            lora_mounted=False,
        )


@router.post("/analyze-case", response_model=CaseAnalysisResponse, summary="Analyze Legal Case (Root Contract)")
@router.post("/lora/analyze-case", response_model=CaseAnalysisResponse, summary="Analyze Legal Case (Scoped)")
def analyze_case(request: CaseAnalysisRequest):
    """
    Analyzes an Indian legal case excerpt using the fine-tuned LoRA model.
    Maintains 100% backwards compatibility with standalone api_server.py.
    """
    runner = get_model_runner()
    try:
        result = runner.analyze_case(
            case_text=request.case_text,
            max_new_tokens=request.max_new_tokens or 128,
            temperature=request.temperature or 0.2,
            top_p=request.top_p or 0.9,
        )
        return CaseAnalysisResponse(
            status="success",
            core_dispute=result["core_dispute"],
            relevant_laws=result["relevant_laws"],
            findings=result["findings"],
            raw_output=result["raw_output"],
            device_used=result["device_used"],
            generation_time_seconds=result["generation_time_seconds"],
            tokens_generated=result["tokens_generated"],
        )
    except Exception as e:
        logger.error(f"LoRA inference failed: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference execution failed: {str(e)}",
        )


@router.post(
    "/lora/grounded-analyze",
    response_model=GroundedCaseAnalysisResponse,
    summary="RAG-Grounded LoRA Case Analysis"
)
def grounded_case_analysis(request: GroundedCaseAnalysisRequest):
    """
    Complete Phase 24 -> Phase 26 pipeline:
    Query -> Hybrid Retrieval -> Context-Injected LoRA Prompt -> Grounded Legal Analysis + Citations.
    """
    # 1. Retrieve statutory provisions
    chunks = retrieval_service.search(
        query=request.case_text,
        corpus="acts",
        top_k=request.top_k or 3,
        issue_type_filter=request.issue_type_filter
    )

    # 2. Build context-augmented case text
    if chunks:
        context_summary = "\n".join([f"- {c.title} ({c.section_ref}): {c.text[:200]}" for c in chunks])
        augmented_text = f"{request.case_text}\n\nApplicable Context:\n{context_summary}"
    else:
        augmented_text = request.case_text

    # 3. Run LoRA Inference
    runner = get_model_runner()
    res = runner.analyze_case(
        case_text=augmented_text,
        max_new_tokens=request.max_new_tokens or 128
    )

    # 4. Attach verifiable citations
    citations, confidence = citation_service.attach_citations(
        answer=res["findings"],
        retrieved_chunks=chunks
    )

    return GroundedCaseAnalysisResponse(
        status="success",
        core_dispute=res["core_dispute"],
        relevant_laws=res["relevant_laws"],
        findings=res["findings"],
        citations=citations,
        confidence=confidence,
        retrieval_count=len(chunks),
        device_used=res["device_used"],
        generation_time_seconds=res["generation_time_seconds"],
    )
