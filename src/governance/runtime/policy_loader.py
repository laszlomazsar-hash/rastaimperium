from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Mapping


class PolicyLoadError(RuntimeError):
    """Raised when governance policy is missing or invalid."""


_ALLOWED_STATES = (
    "INGESTED",
    "NORMALIZED",
    "VERIFIED",
    "CORRELATED",
    "ARCHIVED",
    "CONTESTED",
)


@dataclass(frozen=True)
class RuntimeGuards:
    allowed_fsm_transitions: dict[str, tuple[str, ...]]
    allowed_event_types: tuple[str, ...]
    required_version_bundle_keys: tuple[str, ...]
    enabled_invariants: tuple[str, ...]

    def validate_transition(self, from_state: str, to_state: str) -> None:
        allowed = self.allowed_fsm_transitions.get(from_state, ())
        if to_state not in allowed:
            raise PolicyLoadError(f"Illegal FSM transition: {from_state} -> {to_state}")

    def validate_event_type(self, event_type: str) -> None:
        if event_type not in self.allowed_event_types:
            raise PolicyLoadError(f"Unsupported event type: {event_type}")

    def validate_version_bundle(self, version_bundle: Mapping[str, Any]) -> None:
        missing = [k for k in self.required_version_bundle_keys if k not in version_bundle]
        if missing:
            raise PolicyLoadError(f"Version bundle missing keys: {', '.join(missing)}")


@dataclass(frozen=True)
class RuntimePolicy:
    schema_version: str
    ruleset_version: str
    governance_version: str
    guards: RuntimeGuards


def _as_tuple_strings(values: Any, *, field_name: str) -> tuple[str, ...]:
    if not isinstance(values, list) or not values or any(not isinstance(v, str) or not v for v in values):
        raise PolicyLoadError(f"{field_name} must be a non-empty list[str]")
    return tuple(values)


def load_runtime_policy(manifest_path: str | Path) -> RuntimePolicy:
    path = Path(manifest_path)
    if not path.exists():
        raise PolicyLoadError(f"Governance manifest not found: {path}")

    manifest = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(manifest, dict):
        raise PolicyLoadError("Governance manifest must be a JSON object")

    schema_version = manifest.get("schema_version")
    ruleset_version = manifest.get("ruleset_version")
    governance_version = manifest.get("governance_version")
    if not isinstance(schema_version, str) or not isinstance(ruleset_version, str) or not isinstance(governance_version, str):
        raise PolicyLoadError("schema_version, ruleset_version, and governance_version are required strings")

    if schema_version != "1.0":
        raise PolicyLoadError(f"Unsupported schema_version: {schema_version}")

    guards_payload = manifest.get("guards")
    if not isinstance(guards_payload, dict):
        raise PolicyLoadError("guards is required")

    raw_transitions = guards_payload.get("fsm_transitions")
    if not isinstance(raw_transitions, dict) or not raw_transitions:
        raise PolicyLoadError("guards.fsm_transitions must be a non-empty object")

    transitions: dict[str, tuple[str, ...]] = {}
    for from_state, to_states in raw_transitions.items():
        if from_state not in _ALLOWED_STATES:
            raise PolicyLoadError(f"Unknown FSM from_state: {from_state}")
        normalized_to_states = _as_tuple_strings(to_states, field_name=f"guards.fsm_transitions.{from_state}")
        for to_state in normalized_to_states:
            if to_state not in _ALLOWED_STATES:
                raise PolicyLoadError(f"Unknown FSM to_state: {to_state}")
        transitions[from_state] = normalized_to_states

    guards = RuntimeGuards(
        allowed_fsm_transitions=transitions,
        allowed_event_types=_as_tuple_strings(guards_payload.get("event_types"), field_name="guards.event_types"),
        required_version_bundle_keys=_as_tuple_strings(
            guards_payload.get("required_version_bundle"),
            field_name="guards.required_version_bundle",
        ),
        enabled_invariants=_as_tuple_strings(guards_payload.get("invariants"), field_name="guards.invariants"),
    )

    return RuntimePolicy(
        schema_version=schema_version,
        ruleset_version=ruleset_version,
        governance_version=governance_version,
        guards=guards,
    )
