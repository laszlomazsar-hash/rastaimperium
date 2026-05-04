"""Shared health state for legacy evo-v compatibility APIs."""

from dataclasses import dataclass


@dataclass
class HealthState:
    """Simple container for heartbeat lifecycle state."""

    heartbeat_seen: bool = False

    def mark_heartbeat(self) -> None:
        self.heartbeat_seen = True


# Shared module-level singleton used by API handlers.
health_state = HealthState()
