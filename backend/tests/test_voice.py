"""Tests for Whisper AI Voice Services (/voice/stt, /voice/stt/upload, /voice/tts)."""
import base64
import io
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_voice_stt_json_hindi():
    payload = {
        "audio_base64": base64.b64encode(b"RIFFdummywavdata").decode("utf-8"),
        "lang_hint": "hi"
    }
    resp = client.post("/voice/stt", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["text"]) > 10
    assert data["detected_lang"] == "hi"
    assert data["confidence"] > 0.90


def test_voice_stt_json_english():
    payload = {
        "audio_base64": base64.b64encode(b"RIFFdummywavdata").decode("utf-8"),
        "lang_hint": "en"
    }
    resp = client.post("/voice/stt", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "landlord" in data["text"].lower() or "deposit" in data["text"].lower()
    assert data["detected_lang"] == "en"


def test_voice_stt_upload_multipart():
    dummy_wav = io.BytesIO(b"RIFF\x24\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00\x44\xac\x00\x00data\x00\x00\x00\x00")
    files = {"file": ("test_recording.wav", dummy_wav, "audio/wav")}
    data = {"lang_hint": "hi"}
    resp = client.post("/voice/stt/upload", files=files, data=data)
    assert resp.status_code == 200
    res_json = resp.json()
    assert len(res_json["text"]) > 5
    assert res_json["detected_lang"] == "hi"


def test_voice_tts():
    payload = {
        "text": "उपभोक्ता संरक्षण अधिनियम 2019 के तहत आप शिकायत दर्ज कर सकते हैं।",
        "lang": "hi"
    }
    resp = client.post("/voice/tts", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "/api/v1/voice/stream" in data["audio_url"]
    assert data["lang"] == "hi"
