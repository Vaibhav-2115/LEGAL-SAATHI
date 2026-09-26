"""Routers package for Legal Saathi backend."""
from .health import router as health_router
from .chat import router as chat_router
from .classify import router as classify_router
from .retrieval import router as retrieval_router
from .sources import router as sources_router
from .cases import router as cases_router
from .incidents import router as incidents_router
from .clustering import router as clustering_router
from .actions import actions_router
from .voice import router as voice_router
from .analytics import router as analytics_router
from .billing import router as billing_router

__all__ = [
    "health_router",
    "chat_router",
    "classify_router",
    "retrieval_router",
    "sources_router",
    "cases_router",
    "incidents_router",
    "clustering_router",
    "actions_router",
    "voice_router",
    "analytics_router",
    "billing_router"
]
