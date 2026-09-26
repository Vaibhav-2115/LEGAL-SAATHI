"""
Legal Saathi - Voice & Analytics Schemas
Defines schemas for STT, TTS, and aggregated platform analytics.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class STTRequest(BaseModel):
    audio_base64: Optional[str] = Field(default=None, max_length=35 * 1024 * 1024, description="Base64 encoded audio payload (max 25MB decoded)")
    audio_url: Optional[str] = Field(default=None, max_length=2048, description="Direct URL to audio file")
    lang_hint: Optional[str] = Field(default="auto", max_length=20, description="hi | en | ta | te | bn | mr | gu | kn | auto")


class STTResponse(BaseModel):
    text: str
    detected_lang: str
    confidence: float
    duration_seconds: Optional[float] = None


class TTSRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000, description="Text to synthesize")
    lang: str = Field(default="hi", max_length=20)
    voice_gender: Optional[str] = Field(default="female", max_length=20)



class TTSResponse(BaseModel):
    audio_url: Optional[str] = None
    audio_base64: Optional[str] = None
    lang: str
    format: str = "mp3"


class AnalyticsSummaryResponse(BaseModel):
    total_sessions: int
    total_cases: int
    counts_by_issue_type: Dict[str, int]
    confidence_distribution: Dict[str, int]
    cluster_count: int
    total_clustered_incidents: int
    common_localities: List[Dict[str, Any]]
