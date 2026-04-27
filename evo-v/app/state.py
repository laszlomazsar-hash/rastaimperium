from __future__ import annotations

from copy import deepcopy
from datetime import datetime, timezone
from threading import Lock
from typing import Any


class EngineState:
    """Thread-safe state machine + event ledger for the engine."""

    def __init__(self) -> None:
        self._lock = Lock()
        self._state: dict[str, Any] = {
            "lifecycle": "idle",
            "last_heartbeat": None,
            "last_failure": None,
            "agent_statuses": {},
            "active_sandboxes": 0,
        }
        self._events: list[dict[str, Any]] = []

    def transition(self, *, agent_name: str, status: str) -> None:
        """Atomically update an agent status and append an event ledger entry."""
        now = self._utc_now()
        with self._lock:
            self._state["agent_statuses"][agent_name] = status
            self._events.append(
                {
                    "type": "transition",
                    "agent": agent_name,
                    "status": status,
                    "at": now,
                }
            )

    def mark_failure(self, *, agent_name: str, error: str) -> None:
        """Atomically record failure state and append a failure event."""
        now = self._utc_now()
        with self._lock:
            self._state["lifecycle"] = "failed"
            self._state["last_failure"] = {
                "agent": agent_name,
                "error": error,
                "at": now,
            }
            self._events.append(
                {
                    "type": "failure",
                    "agent": agent_name,
                    "error": error,
                    "at": now,
                }
            )

    def mark_heartbeat(self, *, active_sandboxes: int) -> None:
        """Atomically update heartbeat metadata and append a heartbeat event."""
        now = self._utc_now()
        with self._lock:
            self._state["lifecycle"] = "healthy"
            self._state["last_heartbeat"] = now
            self._state["active_sandboxes"] = active_sandboxes
            self._events.append(
                {
                    "type": "heartbeat",
                    "active_sandboxes": active_sandboxes,
                    "at": now,
                }
            )

    def read_snapshot(self) -> dict[str, Any]:
        """Return immutable-by-convention copy for API responses."""
        with self._lock:
            state_copy = deepcopy(self._state)
            events_copy = deepcopy(self._events)

        return {
            "state": state_copy,
            "events": events_copy,
        }

    @staticmethod
    def _utc_now() -> str:
        return datetime.now(timezone.utc).isoformat()
