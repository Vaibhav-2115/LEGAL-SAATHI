"""
Legal Saathi - Voice Router (voice.py)
Endpoints: POST /voice/stt (Speech to Text), POST /voice/tts (Text to Speech)
Supports regional Indian languages for voice-first citizens.
Per Section 6.2 & 12 of the Technical Blueprint.
"""

from fastapi import APIRouter
from backend.schemas.voice import STTRequest, STTResponse, TTSRequest, TTSResponse
from backend.services.voice_service import voice_service

router = APIRouter(tags=["Voice"])


@router.post("/voice/stt", response_model=STTResponse)
def speech_to_text(payload: STTRequest):
    """
    Converts user audio into clean, normalized text in the detected Indian language.
    """
    res = voice_service.process_stt(
        audio_base64=payload.audio_base64,
        audio_url=payload.audio_url,
        lang_hint=payload.lang_hint or "auto"
    )
    return res


@router.post("/voice/tts", response_model=TTSResponse)
def text_to_speech(payload: TTSRequest):
    """
    Synthesizes grounded legal explanation into clear spoken audio.
    """
    res = voice_service.process_tts(
        text=payload.text,
        lang=payload.lang or "hi"
    )
    return res
