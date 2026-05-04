from datetime import datetime
from enum import Enum
from typing import Any

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class LeadLifecycleStatus(str, Enum):
    NEW = "new"
    QUALIFIED = "qualified"
    DISCOVERY_BOOKED = "discovery_booked"
    PROPOSAL_SENT = "proposal_sent"
    WON = "won"
    LOST = "lost"


class LeadCaptureRequest(BaseModel):
    full_name: str = Field(min_length=2, max_length=255)
    email: EmailStr
    company: str | None = Field(default=None, max_length=255)
    message: str | None = None
    source_page: str = Field(min_length=1, max_length=255)
    consent: bool
    qualification_metadata: dict[str, Any] = Field(default_factory=dict)


class LeadResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    email: EmailStr
    company: str | None
    message: str | None
    source_page: str
    lifecycle_status: LeadLifecycleStatus
    consent: bool
    qualification_metadata: dict[str, Any]
    subscription_customer_id: str | None
    payment_status: str | None
    created_at: datetime
    updated_at: datetime


class LeadStatusUpdateRequest(BaseModel):
    lifecycle_status: LeadLifecycleStatus
    qualification_metadata: dict[str, Any] | None = None


class LeadStatusSummary(BaseModel):
    status: LeadLifecycleStatus
    count: int


class PaymentWebhookEvent(BaseModel):
    event_type: str
    email: EmailStr | None = None
    customer_id: str | None = None
    metadata: dict[str, Any] = Field(default_factory=dict)
