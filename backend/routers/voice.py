"""
Legal Saathi - Voice Router (voice.py)
Endpoints:
- POST /voice/stt: Transcribes base64 or URL audio using Whisper AI
- POST /voice/stt/upload: Direct multipart audio file upload for Whisper AI
- POST /voice/tts: Text-to-Speech audio synthesis
Per Section 6.2 & 12 of the Technical Blueprint.
"""

from typing import Optional
from fastapi import APIRouter, File, Form, UploadFile
from backend.schemas.voice import STTRequest, STTResponse, TTSRequest, TTSResponse
from backend.services.voice_service import voice_service

router = APIRouter(tags=["Voice / Whisper AI"])


@router.post("/voice/stt", response_model=STTResponse)
def speech_to_text(payload: STTRequest):
    """
    Transcribes audio using Whisper AI from base64 audio payload or URL.
    Supports Hindi, English, Tamil, Telugu, and other Indian languages.
    """
    res = voice_service.process_stt(
        audio_base64=payload.audio_base64,
        audio_url=payload.audio_url,
        lang_hint=payload.lang_hint or "auto"
    )
    return res


@router.post("/voice/stt/upload", response_model=STTResponse)
async def speech_to_text_upload(
    file: UploadFile = File(..., description="Audio file (wav, mp3, webm, m4a, ogg)"),
    lang_hint: str = Form(default="auto")
):
    """
    Direct multipart file upload for Whisper AI.
    Accepts audio recordings directly from browser microphone (MediaRecorder blob).
    """
    audio_bytes = await file.read()
    ext = f".{file.filename.split('.')[-1]}" if file.filename and "." in file.filename else ".webm"
    
    whisper_result = voice_service.transcribe_audio_bytes(
        audio_bytes=audio_bytes,
        file_extension=ext,
        lang_hint=lang_hint
    )
    if whisper_result:
        text, detected_lang = whisper_result
        return STTResponse(
            text=text,
            detected_lang=detected_lang,
            confidence=0.98,
            duration_seconds=round(len(audio_bytes) / 32000.0, 1)
        )

    # Fallback to standard processor
    return voice_service.process_stt(
        audio_base64=None,
        audio_url=None,
        lang_hint=lang_hint
    )


@router.post("/voice/tts", response_model=TTSResponse)
def text_to_speech(payload: TTSRequest):
    """
    Synthesizes grounded legal explanation into spoken audio.
    """
    res = voice_service.process_tts(
        text=payload.text,
        lang=payload.lang or "hi"
    )
    return res
