from fastapi import APIRouter

from api.observatory import explain_state_label, get_state_data

router = APIRouter()


@router.get("/epistemic")
async def epistemic() -> dict:
    state_data = get_state_data()
    transitions = state_data["recent_transitions"]

    if transitions:
        recent_transition_summary = [
            f"{item['at']}: state moved from {item['from']} to {item['to']}"
            for item in transitions[-5:]
        ]
    else:
        recent_transition_summary = ["No state transitions have been recorded yet."]

    return {
        "state_label": state_data["state_label"],
        "explanation": explain_state_label(state_data["state_label"]),
        "recent_transitions": recent_transition_summary,
        "watchdog_posture": state_data["watchdog_posture"],
    }
