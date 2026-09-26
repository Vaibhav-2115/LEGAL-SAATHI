"""
Quick launcher for the Legal Saathi FastAPI backend server.
Runs on http://localhost:8000 (Docs: http://localhost:8000/docs)
"""

import os
import sys
import uvicorn

# Add workspace root to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.core.config import settings

if __name__ == "__main__":
    print(f"================================================================")
    print(f" Starting {settings.PROJECT_NAME} v{settings.VERSION}")
    print(f" Environment : {settings.ENVIRONMENT}")
    print(f" Server URL  : http://localhost:{settings.PORT}")
    print(f" API Docs    : http://localhost:{settings.PORT}/docs")
    print(f" Health check: http://localhost:{settings.PORT}/health")
    print(f"================================================================")
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, reload=True)
