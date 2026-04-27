from __future__ import annotations

from fastapi import FastAPI

from src.ark_safety.control_logic import DirectionalProbe, decide_action
from src.codex.compliance import ComplianceEngine

app = FastAPI(title="ARK Safety Governance")
engine = ComplianceEngine()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


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


@app.post("/telemetry/control-decision")
def control_decision(directions: list[float], confidences: list[float]) -> dict[str, object]:
    probes = [DirectionalProbe(direction=d, confidence=c) for d, c in zip(directions, confidences)]
    decision = decide_action(probes)
    return {"g_hat": decision.g_hat, "action": decision.action}
