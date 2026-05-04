from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any

from fastapi import FastAPI

from codex.compliance import ComplianceEngine, ReplayResult

from backend.src.runtime_import_guard import install_legacy_import_guard

install_legacy_import_guard()

SCHEMA_VERSION = "1.1.0"



def _utc_iso_now() -> str:
    return datetime.now(timezone.utc).isoformat()


@dataclass
class RuntimeState:
    current_state: str = "healthy"
    previous_state: str | None = None
    last_transition_at: str = field(default_factory=_utc_iso_now)
    transition_history: list[dict[str, Any]] = field(default_factory=list)
    failure_count: int = 0
    last_failure: dict[str, Any] | None = None

    def transition_to(self, next_state: str, reason: str) -> None:
        if next_state == self.current_state:
            return

        transitioned_at = _utc_iso_now()
        transition_record = {
            "from": self.current_state,
            "to": next_state,
            "reason": reason,
            "at": transitioned_at,
        }
        self.previous_state = self.current_state
        self.current_state = next_state
        self.last_transition_at = transitioned_at
        self.transition_history.append(transition_record)
        self.transition_history = self.transition_history[-25:]

    def sync_with_rollback_readiness(self, rollback_ready: bool) -> None:
        expected_state = "degraded" if rollback_ready else "healthy"
        reason = "rollback_signal_detected" if rollback_ready else "rollback_signal_cleared"
        self.transition_to(expected_state, reason)

    def record_failure(self, actor: str, reason: str) -> None:
        self.failure_count += 1
        self.last_failure = {
            "actor": actor,
            "reason": reason,
            "at": _utc_iso_now(),
        }
        self.transition_to("rollback_triggered", "manual_rollback_triggered")

    def state_payload(self) -> dict[str, Any]:
        return {
            "schema_version": SCHEMA_VERSION,
            "state": self.current_state,
            "previous_state": self.previous_state,
            "last_transition_at": self.last_transition_at,
            "transition_history": list(self.transition_history),
            "failure_count": self.failure_count,
            "last_failure": self.last_failure,
            # Backward-compatible alias for probes expecting generic status keys.
            "status": self.current_state,
        }

    def health_payload(self, rollback_ready: bool) -> dict[str, Any]:
        return {
            "schema_version": SCHEMA_VERSION,
            "status": "ok" if self.current_state == "healthy" else "degraded",
            "rollback_ready": rollback_ready,
            "state_summary": {
                "state": self.current_state,
                "previous_state": self.previous_state,
                "last_transition_at": self.last_transition_at,
                "failure_count": self.failure_count,
            },
        }


app = FastAPI(title="ARK Safety Governance")
engine = ComplianceEngine()
STATE = RuntimeState()
OBSERVABILITY_SCHEMA_VERSION = SCHEMA_VERSION


@app.get("/health")
def health() -> dict[str, object]:
    rollback_ready = engine.should_trigger_rollback()
    STATE.sync_with_rollback_readiness(rollback_ready)
    return STATE.health_payload(rollback_ready=rollback_ready)


@app.get("/state")
def state() -> dict[str, object]:
    rollback_ready = engine.should_trigger_rollback()
    coverage = engine.trace_coverage_graph()
    return {
        "schema_version": OBSERVABILITY_SCHEMA_VERSION,
        "rollback_ready": rollback_ready,
        "trace_coverage": coverage,
        # Backward-compatible alias expected by monitor checks.
        "coverage": coverage,
    }


@app.get("/epistemic")
def epistemic() -> dict[str, object]:
    audit_record = engine.append_audit_record(
        actor="monitor",
        action="epistemic_snapshot",
        article="II",
        metadata={"source": "external_monitor"},
    )
    coverage = engine.trace_coverage_graph()
    rollback_ready = engine.should_trigger_rollback()
    return {
        "schema_version": OBSERVABILITY_SCHEMA_VERSION,
        "trace_coverage": round(sum(item["coverage"] for item in coverage) / max(len(coverage), 1), 2),
        "rollback_ready": rollback_ready,
        "latest_audit_digest": audit_record.digest,
        "audit_log_entries": len(engine.audit_log),
        "trace_layers_monitored": len(coverage),
    }


@app.get("/telemetry/coverage")
def telemetry_coverage() -> dict[str, object]:
    rollback_ready = engine.should_trigger_rollback()
    STATE.sync_with_rollback_readiness(rollback_ready)
    return {
        "schema_version": OBSERVABILITY_SCHEMA_VERSION,
        "coverage": engine.trace_coverage_graph(),
        "rollback_ready": rollback_ready,
        "likelihood_diagnostics": engine.likelihood_diagnostics(),
    }


@app.post("/telemetry/rollback")
def trigger_rollback(actor: str, reason: str) -> dict[str, object]:
    record = engine.append_audit_record(
        actor=actor,
        action="rollback_trigger",
        article="III",
        metadata={"reason": reason},
    )
    STATE.record_failure(actor=actor, reason=reason)
    return {
        "schema_version": OBSERVABILITY_SCHEMA_VERSION,
        "ok": True,
        "audit_digest": record.digest,
    }
