"""
Legal Saathi - Indian Legal LLaMA LoRA REST API Backend
FastAPI server exposing endpoints for legal case analysis and system health checks.
"""

from contextlib import asynccontextmanager
import os
from pathlib import Path
import sys
import time
from typing import List, Optional

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uvicorn

# Configure UTF-8 on Windows
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

from model_runner import IndianLegalModelRunner

runner: Optional[IndianLegalModelRunner] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initializes the LoRA model runner on startup."""
    global runner
    print(">> Starting Legal Saathi LLaMA LoRA Backend Service...")
    runner = IndianLegalModelRunner.get_instance()
    yield
    print(">> Shutting down Legal Saathi LLaMA LoRA Backend Service...")


app = FastAPI(
    title="Legal Saathi - Indian Legal LLaMA API",
    description="Fine-tuned LLaMA-3.2-1B with PEFT LoRA adapter for Indian statutory analysis.",
    version="1.0.0",
    lifespan=lifespan,
)

# Enable CORS for Next.js / Streamlit / external clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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


class HealthResponse(BaseModel):
    status: str
    model_name: str
    adapter_name: str
    device: str
    is_ready: bool
    lora_mounted: bool


@app.get(
    "/health",
    response_model=HealthResponse,
    summary="Health & Model Readiness Check",
    tags=["System"],
)
async def health_check():
    """Verifies that the server is operational and the LoRA adapter is mounted."""
    global runner
    if runner is None or not runner.is_ready:
        return HealthResponse(
            status="loading",
            model_name="unsloth/Llama-3.2-1B-Instruct-bnb-4bit",
            adapter_name="indian_legal_llama_lora",
            device="unknown",
            is_ready=False,
            lora_mounted=False,
        )

    return HealthResponse(
        status="ready",
        model_name=runner.base_model_name,
        adapter_name=runner.adapter_path.name,
        device=runner.device,
        is_ready=True,
        lora_mounted=True,
    )


@app.post(
    "/analyze-case",
    response_model=CaseAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze Indian Legal Case Excerpt",
    tags=["Legal Inference"],
)
async def analyze_case(request: CaseAnalysisRequest):
    """
    Analyzes an Indian legal case excerpt using the fine-tuned LoRA model.
    Returns structured analysis containing the core dispute, relevant statutory sections, and legal findings.
    """
    global runner
    if runner is None or not runner.is_ready:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model is currently initializing. Please retry in a few seconds.",
        )

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
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference execution failed: {str(e)}",
        )


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    print(f">> Launching Legal Saathi LoRA API on http://0.0.0.0:{port}")
    uvicorn.run("api_server:app", host="0.0.0.0", port=port, reload=False)
