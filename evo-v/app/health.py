from __future__ import annotations

import asyncio
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any

SCHEMA_VERSION = "2026-04-26"
HEARTBEAT_STALE_SECONDS = 60.0
EXPECTED_ROUTES = frozenset(
    {
        "/health",
        "/api/observatory/heartbeat",
        "/api/provisioning/provision",
    }
)


def _utc_iso_now() -> str:
    return datetime.now(timezone.utc).isoformat()


@dataclass
class HealthState:
    """In-memory health state for deterministic probe responses."""

    started_at_monotonic: float = field(default_factory=time.monotonic)
    last_heartbeat_monotonic: float | None = None
    last_heartbeat_at: str | None = None

    def mark_heartbeat(self) -> None:
        now_monotonic = time.monotonic()
        self.last_heartbeat_monotonic = now_monotonic
        self.last_heartbeat_at = _utc_iso_now()

    def _evaluate_invariants(self, *, route_paths: set[str]) -> dict[str, dict[str, Any]]:
        now_monotonic = time.monotonic()
        missing_routes = sorted(EXPECTED_ROUTES.difference(route_paths))
        route_ok = not missing_routes

        loop_ok = True
        loop_failure: str | None = None
        try:
            asyncio.get_running_loop()
        except RuntimeError as exc:
            loop_ok = False
            loop_failure = str(exc)

        heartbeat_age_seconds: float | None = None
        heartbeat_fresh = False
        if self.last_heartbeat_monotonic is not None:
            heartbeat_age_seconds = now_monotonic - self.last_heartbeat_monotonic
            heartbeat_fresh = heartbeat_age_seconds <= HEARTBEAT_STALE_SECONDS

        return {
            "route_integrity": {
                "ok": route_ok,
                "missing_routes": missing_routes,
            },
            "event_loop": {
                "ok": loop_ok,
                "failure": loop_failure,
            },
            "heartbeat_freshness": {
                "ok": heartbeat_fresh,
                "last_heartbeat_at": self.last_heartbeat_at,
                "max_age_seconds": HEARTBEAT_STALE_SECONDS,
                "age_seconds": heartbeat_age_seconds,
            },
        }

    def evaluate(self, *, route_paths: set[str]) -> dict[str, Any]:
        checks = self._evaluate_invariants(route_paths=route_paths)

        check_failures = [
            {"check": name, "metadata": details}
            for name, details in checks.items()
            if not details["ok"]
        ]

        if check_failures:
            epistemic_state = "degraded"
        elif self.last_heartbeat_monotonic is None:
            epistemic_state = "unknown"
        else:
            epistemic_state = "known_good"

        alive = bool(
            checks["route_integrity"]["ok"]
            and checks["event_loop"]["ok"]
            and epistemic_state in {"known_good", "degraded"}
        )

        return {
            "schema_version": SCHEMA_VERSION,
            "alive": alive,
            "state": epistemic_state,
            "timestamp": _utc_iso_now(),
            "checks": checks,
            "failures": check_failures,
        }


health_state = HealthState()
