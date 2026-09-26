"""Actions Router Package."""
from fastapi import APIRouter
from .notice import router as notice_router
from .rti import router as rti_router
from .dlsa import router as dlsa_router
from .efir import router as efir_router
from .checklist import router as checklist_router

actions_router = APIRouter()
actions_router.include_router(notice_router)
actions_router.include_router(rti_router)
actions_router.include_router(dlsa_router)
actions_router.include_router(efir_router)
actions_router.include_router(checklist_router)

__all__ = ["actions_router"]
