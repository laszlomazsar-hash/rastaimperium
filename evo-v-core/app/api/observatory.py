from collections import deque
from datetime import datetime, timezone

from fastapi import APIRouter

from core.runtime_state import engine, runtime_state

router = APIRouter()
_transition_log: deque[dict[str, str]] = deque(maxlen=20)
_last_state_label = "initializing"


_STATE_EXPLANATIONS = {
    "initializing": "The observatory just started and is collecting its first state snapshot.",
    "idle": "No agents are provisioned yet, so the system is standing by.",
    "ready": "Agents are provisioned and waiting for work.",
    "active": "One or more agents are actively processing work.",
    "degraded": "At least one agent is frozen and operator attention is recommended.",
}


_WATCHDOG_POSTURES = {
    "initializing": "monitoring",
    "idle": "monitoring",
    "ready": "monitoring",
    "active": "watchful",
    "degraded": "intervention-required",
}


def _determine_state_label(snapshot: dict) -> str:
    statuses = snapshot["statuses"]
    if not snapshot["agents"]:
        return "idle"
    if any(status == "frozen" for status in statuses):
        return "degraded"
    if any(status in {"running", "active", "processing"} for status in statuses):
        return "active"
    return "ready"


def _record_transition(next_label: str) -> None:
    global _last_state_label
    if next_label == _last_state_label:
        return
    now = datetime.now(timezone.utc).isoformat(timespec="seconds")
    _transition_log.append(
        {
            "at": now,
            "from": _last_state_label,
            "to": next_label,
        }
    )
    _last_state_label = next_label


def get_state_data() -> dict:
    snapshot = engine.audit_state()
    state_label = _determine_state_label(snapshot)
    _record_transition(state_label)
    return {
        "state_label": state_label,
        "snapshot": snapshot,
        "recent_transitions": list(_transition_log),
        "watchdog_posture": _WATCHDOG_POSTURES[state_label],
    }


@router.get("/heartbeat")
async def heartbeat() -> dict:
    snapshot = engine.audit_state()
    runtime_state.set_watchdog("nominal")
    return {"status": "ok", "snapshot": snapshot}


@router.get("/state")
async def state() -> dict:
    return get_state_data()


def explain_state_label(label: str) -> str:
    return _STATE_EXPLANATIONS.get(label, "The system state is available but not categorized.")
