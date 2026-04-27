from __future__ import annotations

from fastapi import FastAPI

from src.codex.compliance import ComplianceEngine

SCHEMA_VERSION = "1.0.0"

app = FastAPI(title="ARK Safety Governance")
engine = ComplianceEngine()


@app.get("/health")
def health() -> dict[str, object]:
    return {
        "schema_version": SCHEMA_VERSION,
        "status": "ok",
    }


@app.get("/state")
def state() -> dict[str, object]:
    return {
        "schema_version": SCHEMA_VERSION,
        "coverage": engine.trace_coverage_graph(),
        "rollback_ready": engine.should_trigger_rollback(),
    }


@app.get("/epistemic")
def epistemic() -> dict[str, object]:
    audit_record = engine.append_audit_record(
        actor="monitor",
        action="epistemic_snapshot",
        article="II",
        metadata={"source": "external_monitor"},
    )
    return {
        "schema_version": SCHEMA_VERSION,
        "trace_coverage": round(sum(item["coverage"] for item in engine.trace_coverage_graph()) / 9, 2),
        "rollback_ready": engine.should_trigger_rollback(),
        "latest_audit_digest": audit_record.digest,
    }


@app.get("/telemetry/coverage")
def telemetry_coverage() -> dict[str, object]:
    return {
        "schema_version": SCHEMA_VERSION,
        "coverage": engine.trace_coverage_graph(),
        "rollback_ready": engine.should_trigger_rollback(),
    }


@app.post("/telemetry/rollback")
def trigger_rollback(actor: str, reason: str) -> dict[str, object]:
    record = engine.append_audit_record(
        actor=actor,
        action="rollback_trigger",
        article="III",
        metadata={"reason": reason},
    )
    return {
        "schema_version": SCHEMA_VERSION,
        "ok": True,
        "audit_digest": record.digest,
    }
