"""
Legal Saathi - In-Memory Sliding Window Rate Limiter (SEC-005)
Protects endpoints such as /chat, /voice, and /retrieval against abuse.
"""

from collections import defaultdict
import time
from typing import Dict, List
from fastapi import HTTPException, Request, status
from backend.core.config import settings

# Key -> List of timestamps
_request_history: Dict[str, List[float]] = defaultdict(list)


def check_rate_limit(
    key: str,
    max_requests: int = settings.RATE_LIMIT_REQUESTS_PER_MINUTE,
    window_seconds: int = 60
) -> None:
    """
    Checks if a given key has exceeded max_requests in the last window_seconds.
    Raises HTTP 429 Too Many Requests if breached.
    """
    now = time.time()
    cutoff = now - window_seconds
    
    # Filter out old requests
    timestamps = [ts for ts in _request_history[key] if ts > cutoff]
    
    if len(timestamps) >= max_requests:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={
                "error": "rate_limit_exceeded",
                "message": f"Rate limit of {max_requests} requests per {window_seconds}s exceeded. Please slow down."
            }
        )
    
    timestamps.append(now)
    _request_history[key] = timestamps


def rate_limit_dependency(request: Request):
    """
    FastAPI dependency to rate limit by client IP or session header.
    """
    client_ip = request.client.host if request.client else "127.0.0.1"
    session_id = request.headers.get("X-Session-ID", client_ip)
    check_rate_limit(key=session_id)
