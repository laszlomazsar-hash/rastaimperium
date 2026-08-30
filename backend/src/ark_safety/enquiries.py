from __future__ import annotations

import os
import time
from collections import defaultdict
from threading import Lock
from typing import Any

from fastapi import HTTPException, Request, status
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
from sqlalchemy import create_engine, text


class EnquiryPayload(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(min_length=2, max_length=255)
    email: EmailStr
    context: str = Field(min_length=20, max_length=5000)
    consent: bool
    website: str = Field(default="", max_length=0)

    @field_validator("name", "context")
    @classmethod
    def reject_blank_values(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("This field is required")
        return value


class EnquiryResult(BaseModel):
    ok: bool
    reference: str


class EnquiryRateLimiter:
    def __init__(self, window_seconds: int = 900, max_requests: int = 5) -> None:
        self.window_seconds = window_seconds
        self.max_requests = max_requests
        self._requests: dict[str, list[float]] = defaultdict(list)
        self._lock = Lock()

    def allow(self, key: str) -> bool:
        now = time.time()
        with self._lock:
            recent = [timestamp for timestamp in self._requests[key] if timestamp > now - self.window_seconds]
            if len(recent) >= self.max_requests:
                self._requests[key] = recent
                return False
            recent.append(now)
            self._requests[key] = recent
            return True


rate_limiter = EnquiryRateLimiter()
_engine = None
_engine_lock = Lock()


def _get_engine():
    global _engine
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        return None
    with _engine_lock:
        if _engine is None:
            _engine = create_engine(database_url, pool_pre_ping=True, pool_recycle=1800)
        return _engine


def _client_key(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for", "")
    return forwarded.split(",", 1)[0].strip() or (request.client.host if request.client else "unknown")


def save_enquiry(payload: EnquiryPayload) -> int:
    engine = _get_engine()
    if engine is None:
        raise RuntimeError("DATABASE_URL is not configured")
    statement = text("""
        INSERT INTO leads (full_name, email, message, source_page, lifecycle_status, consent, qualification_metadata)
        VALUES (:full_name, :email, :message, :source_page, :lifecycle_status, :consent, CAST(:qualification_metadata AS JSON))
        RETURNING id
    """)
    with engine.begin() as connection:
        result = connection.execute(statement, {
            "full_name": payload.name,
            "email": str(payload.email).lower(),
            "message": payload.context,
            "source_page": "rasta-royal-contact",
            "lifecycle_status": "new",
            "consent": payload.consent,
            "qualification_metadata": "{}",
        })
        return int(result.scalar_one())


def create_enquiry(request: Request, payload: EnquiryPayload) -> EnquiryResult:
    if not rate_limiter.allow(_client_key(request)):
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many enquiries. Please try again later.")
    try:
        enquiry_id = save_enquiry(payload)
    except Exception as error:
        # Never expose connection details or submitted content to the client.
        print(f"[enquiry] persistence failure: {type(error).__name__}")
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="The engagement desk is temporarily unavailable. Please try again shortly.") from error
    return EnquiryResult(ok=True, reference=f"RI-{enquiry_id:06d}")
