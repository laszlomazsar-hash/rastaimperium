from __future__ import annotations

from fastapi import FastAPI

from src.codex.compliance import ComplianceEngine

app = FastAPI(title="ARK Safety Governance")
engine = ComplianceEngine()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/telemetry/coverage")
def telemetry_coverage() -> dict[str, object]:
    return {
        "coverage": engine.trace_coverage_graph(),
        "rollback_ready": engine.should_trigger_rollback(),
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
    return {"ok": True, "audit_digest": record.digest}
