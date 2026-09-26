"""
Legal Saathi - In-Memory Sliding Window Rate Limiter (SEC-005)
Protects endpoints such as /chat, /voice, and /retrieval against abuse.
"""

from collections import defaultdict
import threading
import time
from typing import Dict, List
from fastapi import HTTPException, Request, status
from backend.core.config import settings


# Thread-safe in-memory sliding window history: Key -> List of timestamps
_request_history: Dict[str, List[float]] = defaultdict(list)
_rate_limit_lock = threading.Lock()
_last_cleanup = time.time()


def _cleanup_stale_entries(now: float, window_seconds: int = 120):
    """Prunes expired keys to prevent memory leaks from inactive sessions."""
    global _last_cleanup
    if now - _last_cleanup < 60:
        return
    _last_cleanup = now
    cutoff = now - window_seconds
    stale_keys = [k for k, v in _request_history.items() if not v or max(v) <= cutoff]
    for k in stale_keys:
        _request_history.pop(k, None)


def check_rate_limit(
    key: str,
    max_requests: int = settings.RATE_LIMIT_REQUESTS_PER_MINUTE,
    window_seconds: int = 60
) -> None:
    """
    Checks if a given key has exceeded max_requests in the last window_seconds.
    Thread-safe and guarded against memory exhaustion.
    Raises HTTP 429 Too Many Requests if breached.
    """
    now = time.time()
    cutoff = now - window_seconds

    with _rate_limit_lock:
        _cleanup_stale_entries(now, window_seconds=window_seconds * 2)

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
