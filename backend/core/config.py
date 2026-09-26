"""
Legal Saathi - Core Configuration
Loads environment variables, service settings, and LLM configuration.
"""

from typing import List
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    PROJECT_NAME: str = "Legal Saathi API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"

    # Server settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS - Explicit trusted origins only (no wildcard with credentials)
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ]

    # Cryptographic & Security Keys
    SECRET_KEY: str = "dev-insecure-secret-key-change-in-production"
    MAX_AUDIO_UPLOAD_BYTES: int = 25 * 1024 * 1024  # 25MB

    # AI / LLM Configuration
    GEMINI_API_KEY: str = ""
    PRIMARY_LLM_MODEL: str = "gemini-2.5-flash"
    FALLBACK_LLM_MODEL: str = "local-grounded-synthesis"
    LLM_TIMEOUT_SECONDS: float = 8.0

    # Whisper AI Configuration (STT)
    OPENAI_API_KEY: str = ""
    WHISPER_MODEL: str = "whisper-1"

    # Retrieval Configuration
    TOP_K_CHUNKS: int = 5
    HYBRID_RRF_K: int = 60
    BM25_WEIGHT: float = 0.5
    VECTOR_WEIGHT: float = 0.5

    # Security & Rate Limiting
    MAX_TEXT_LENGTH: int = 5000
    RATE_LIMIT_REQUESTS_PER_MINUTE: int = 60

    # Persistence
    DATABASE_PATH: str = "legal_saathi.db"

    # Payment Gateway Configuration (Razorpay / Cashfree)
    RAZORPAY_KEY_ID: str = "rzp_test_mock_legal_saathi"
    RAZORPAY_KEY_SECRET: str = "rzp_test_secret_legal_saathi"
    RAZORPAY_WEBHOOK_SECRET: str = "rzp_test_webhook_secret"
    ENABLE_MOCK_PAYMENTS: bool = True


settings = Settings()
