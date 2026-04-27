from __future__ import annotations

from fastapi import FastAPI

from src.codex.compliance import ComplianceEngine

app = FastAPI(title="ARK Safety Governance")
engine = ComplianceEngine()
OBSERVABILITY_SCHEMA_VERSION = "1.0.0"


@app.get("/health")
def health() -> dict[str, str]:
    return {
        "schema_version": OBSERVABILITY_SCHEMA_VERSION,
        "status": "ok",
    }


@app.get("/state")
def state() -> dict[str, object]:
    return {
        "schema_version": OBSERVABILITY_SCHEMA_VERSION,
        "rollback_ready": engine.should_trigger_rollback(),
        "trace_coverage": engine.trace_coverage_graph(),
    }


@app.get("/epistemic")
def epistemic() -> dict[str, object]:
    return {
        "schema_version": OBSERVABILITY_SCHEMA_VERSION,
        "audit_log_entries": len(engine.audit_log),
        "trace_layers_monitored": len(engine.trace_coverage_graph()),
    }


@app.get("/telemetry/coverage")
def telemetry_coverage() -> dict[str, object]:
    return {"coverage": engine.trace_coverage_graph(), "rollback_ready": engine.should_trigger_rollback()}


@app.post("/telemetry/rollback")
def trigger_rollback(actor: str, reason: str) -> dict[str, object]:
    record = engine.append_audit_record(
        actor=actor,
        action="rollback_trigger",
        article="III",
        metadata={"reason": reason},
    )
    return {"ok": True, "audit_digest": record.digest}
