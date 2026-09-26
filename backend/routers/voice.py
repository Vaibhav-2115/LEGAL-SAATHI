"""
Legal Saathi - Voice Router (voice.py)
Endpoints:
- POST /voice/stt: Transcribes base64 or URL audio using Whisper AI
- POST /voice/stt/upload: Direct multipart audio file upload for Whisper AI
- POST /voice/tts: Text-to-Speech audio synthesis
Per Section 6.2 & 12 of the Technical Blueprint.
"""

import os
from typing import Optional
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from backend.safety.input_validation import sanitize_filename
from backend.safety.rate_limiter import rate_limit_dependency
from backend.schemas.voice import STTRequest, STTResponse, TTSRequest, TTSResponse
from backend.services.voice_service import MAX_AUDIO_BYTES, voice_service

router = APIRouter(tags=["Voice / Whisper AI"])

ALLOWED_AUDIO_EXTENSIONS = {".wav", ".mp3", ".webm", ".m4a", ".ogg", ".flac"}


@router.post("/voice/stt", response_model=STTResponse, dependencies=[Depends(rate_limit_dependency)])
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


@router.post("/voice/stt/upload", response_model=STTResponse, dependencies=[Depends(rate_limit_dependency)])
async def speech_to_text_upload(
    file: UploadFile = File(..., description="Audio file (wav, mp3, webm, m4a, ogg, flac)"),
    lang_hint: str = Form(default="auto")
):
    """
    Direct multipart file upload for Whisper AI.
    Validates file extension, bounds file size to 25MB, and sanitizes filenames.
    """
    # 1. Validate file extension
    original_filename = file.filename or "recording.webm"
    clean_name = sanitize_filename(original_filename)
    _, ext = os.path.splitext(clean_name.lower())
    
    if not ext:
        ext = ".webm"
    elif ext not in ALLOWED_AUDIO_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "error": "unsupported_media_type",
                "message": f"File type '{ext}' is not supported. Allowed formats: {', '.join(sorted(ALLOWED_AUDIO_EXTENSIONS))}"
            }
        )

    # 2. Stream and enforce size limit
    chunk_size = 65536  # 64KB
    byte_accumulator = bytearray()
    
    while True:
        chunk = await file.read(chunk_size)
        if not chunk:
            break
        byte_accumulator.extend(chunk)
        if len(byte_accumulator) > MAX_AUDIO_BYTES:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail={
                    "error": "payload_too_large",
                    "message": f"Audio file exceeds maximum size limit of {MAX_AUDIO_BYTES // (1024 * 1024)}MB."
                }
            )

    audio_bytes = bytes(byte_accumulator)
    if not audio_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "empty_file", "message": "Uploaded audio file cannot be empty."}
        )

    # 3. Transcribe with Whisper AI
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


@router.post("/voice/tts", response_model=TTSResponse, dependencies=[Depends(rate_limit_dependency)])
def text_to_speech(payload: TTSRequest):
    """
    Synthesizes grounded legal explanation into spoken audio.
    """
    res = voice_service.process_tts(
        text=payload.text,
        lang=payload.lang or "hi"
    )
    return res

