from fastapi import APIRouter

from state import state_machine

router = APIRouter()


@router.get("/state")
def get_state() -> dict[str, object]:
    state = state_machine.as_dict()
    return {
        "status": "ok",
        "state": state_machine.current_state,
        "current_state": state["current_state"],
        "previous_state": state["previous_state"],
        "last_transition_at": state["last_transition_at"],
        "transition_history": state["transition_history"],
    }
