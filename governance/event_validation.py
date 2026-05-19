"""Governance validation interface for deterministic event admission."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Mapping, Protocol

from runtime.event_schema import RuntimeEvent


@dataclass(frozen=True)
class ValidationResult:
    is_valid: bool
    reasons: tuple[str, ...]


class EventValidator(Protocol):
    """Validate an event against current state and return explicit reasons."""

    def validate(
        self,
        event: RuntimeEvent,
        current_state: Mapping[str, Any],
    ) -> ValidationResult:
        """Return pass/fail with deterministic reason strings."""
