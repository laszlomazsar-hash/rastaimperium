from typing import List

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.core.runtime_state import runtime_state

router = APIRouter()


class TransitionEvent(BaseModel):
    to: str = Field(description="State entered during a recent transition.")
    reason: str = Field(description="Human-readable explanation for the transition.")
    at: str = Field(description="UTC timestamp for when the transition occurred.")


class EpistemicStateResponse(BaseModel):
    current_state: str = Field(description="Current epistemic mode of the runtime.")
    state_reason: str = Field(description="Human-readable reason for the current state.")
    last_transition_at: str = Field(description="UTC timestamp of the latest state transition.")
    recent_transitions: List[TransitionEvent] = Field(
        description="Most recent state transitions, newest first, bounded in length."
    )
    watchdog_status: str = Field(description="Human-readable watchdog health signal.")


@router.get("/epistemic", response_model=EpistemicStateResponse)
def get_epistemic_state() -> EpistemicStateResponse:
    return EpistemicStateResponse(**runtime_state.snapshot(limit=10))
