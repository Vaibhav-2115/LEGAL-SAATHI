"""
Legal Saathi - Voice & Analytics Schemas
Defines schemas for STT, TTS, and aggregated platform analytics.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class STTRequest(BaseModel):
    audio_base64: Optional[str] = Field(default=None, description="Base64 encoded audio payload")
    audio_url: Optional[str] = Field(default=None, description="Direct URL to audio file")
    lang_hint: Optional[str] = Field(default="auto", description="hi | en | ta | te | bn | mr | gu | kn | auto")


class STTResponse(BaseModel):
    text: str
    detected_lang: str
    confidence: float
    duration_seconds: Optional[float] = None


class TTSRequest(BaseModel):
    text: str
    lang: str = "hi"
    voice_gender: Optional[str] = "female"


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
