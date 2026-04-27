from __future__ import annotations

from fastapi import FastAPI

from src.codex.compliance import ComplianceEngine, ReplayResult

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
        "diagnostics": engine.runtime_diagnostics(),
    }


@app.post("/telemetry/replay-check")
def replay_check(hash_match: bool, max_abs_error: float, p_value: float) -> dict[str, object]:
    return engine.evaluate_replay_acceptance(
        ReplayResult(hash_match=hash_match, max_abs_error=max_abs_error, p_value=p_value)
    )


@app.post("/telemetry/rollback")
def trigger_rollback(actor: str, reason: str) -> dict[str, object]:
    record = engine.append_audit_record(
        actor=actor,
        action="rollback_trigger",
        article="III",
        metadata={"reason": reason},
    )
    return {"ok": True, "audit_digest": record.digest}
