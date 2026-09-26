"""
Legal Saathi - Main FastAPI Application (main.py)
Entry point for the backend service.
Wires all routers, safety middleware, CORS, and centralized error handling.
Per Section 10 & 11 of the Technical Blueprint.
"""

import uuid
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.core.config import settings
from backend.core.logging import logger
from backend.routers import (
    health_router,
    chat_router,
    classify_router,
    retrieval_router,
    sources_router,
    cases_router,
    incidents_router,
    clustering_router,
    actions_router,
    voice_router,
    analytics_router,
    billing_router,
    lora_router
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.PROJECT_NAME} v{settings.VERSION} [{settings.ENVIRONMENT}]")
    yield
    logger.info(f"Shutting down {settings.PROJECT_NAME}")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Evidence-Grounded Legal Copilot for Indian Citizens — Multilingual, Voice-Capable, and Pattern-Detecting.",
    version=settings.VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)


# 1. Request ID / Correlation ID Middleware
@app.middleware("http")
async def add_correlation_id(request: Request, call_next):
    request_id = request.headers.get("X-Request-ID") or f"req-{uuid.uuid4().hex[:12]}"
    request.state.request_id = request_id
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response


# 2. Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(self), camera=()"
    if settings.ENVIRONMENT == "production":
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response


# 2. Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "X-Session-ID"],
)



# 2. Centralized Error Handler (Matching Part 7 Error Contract: { "error": "...", "code": ... })
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "internal_server_error",
            "message": "An unexpected error occurred while processing your legal request.",
            "code": 500
        }
    )


# 3. Mount Routers under both Root and /api/v1 for convenience and strict frontend contract
routers = [
    health_router,
    chat_router,
    classify_router,
    retrieval_router,
    sources_router,
    cases_router,
    incidents_router,
    clustering_router,
    actions_router,
    voice_router,
    analytics_router,
    billing_router,
    lora_router
]

for r in routers:
    # Mount directly at root (matches Part 7 contracts e.g. /chat, /cases, /classify)
    app.include_router(r)
    # Also mount under /api/v1
    app.include_router(r, prefix=settings.API_V1_STR)


@app.get("/", tags=["Root"])
def root():
    return {
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "health": "/health",
        "status": "online"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
