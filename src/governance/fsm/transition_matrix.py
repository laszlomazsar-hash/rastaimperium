"""Deterministic lifecycle transition matrix sourced from policy manifest."""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any


MANIFEST_PATH = Path(__file__).with_name("policy_manifest.json")


@dataclass(frozen=True)
class TransitionResult:
    state: str
    applied: bool
    audit_event: dict[str, Any]


def _load_manifest() -> dict[str, Any]:
    return json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))


def is_transition_allowed(from_state: str, to_state: str) -> bool:
    """Return whether a transition is legal under the executable policy manifest."""
    manifest = _load_manifest()
    if to_state in manifest.get("any_to", []):
        return True

    allowed = manifest.get("allowed_transitions", {}).get(from_state, [])
    return to_state in allowed


def _build_failure_audit_payload(
    state: str,
    requested_state: str,
    transition_event: dict[str, Any],
) -> dict[str, Any]:
    manifest = _load_manifest()
    return {
        "event_type": "STATE_TRANSITION_REJECTED",
        "reason": "illegal_transition",
        "from_state": state,
        "to_state": requested_state,
        "allowed": manifest.get("allowed_transitions", {}).get(state, []),
        "any_to": manifest.get("any_to", []),
        "request_id": transition_event.get("request_id"),
        "operator_id": transition_event.get("operator_id"),
        "actor_key_id": transition_event.get("actor_key_id"),
        "service_principal": transition_event.get("service_principal"),
        "version_bundle": {
            "schema_version": manifest.get("schema_version"),
            "ruleset_version": manifest.get("ruleset_version"),
            "governance_version": manifest.get("governance_version"),
            "canon_spec_version": manifest.get("canon_spec_version"),
            "cert_profile": transition_event.get("cert_profile"),
        },
    }


def apply_transition(state: str, transition_event: dict[str, Any]) -> TransitionResult:
    """Apply a state transition with no hidden side effects.

    The function is pure: it does not mutate external state and returns the result
    plus an explicit audit payload for both success and rejection paths.
    """

    requested_state = str(transition_event.get("to_state", ""))
    if is_transition_allowed(state, requested_state):
        return TransitionResult(
            state=requested_state,
            applied=True,
            audit_event={
                "event_type": "STATE_TRANSITION",
                "from_state": state,
                "to_state": requested_state,
            },
        )

    return TransitionResult(
        state=state,
        applied=False,
        audit_event=_build_failure_audit_payload(state, requested_state, transition_event),
    )
