"""Proof inference verifier and attack surface checks."""

from __future__ import annotations

from dataclasses import dataclass
import math
from typing import Any

from state import ProofStatus


@dataclass
class ProofVerificationResult:
    status: ProofStatus
    reason: str
    evidence: dict[str, Any]
    hard_fail_eligible: bool = False


def _normalize_assumptions(raw: Any) -> list[Any]:
    if raw is None:
        return []
    if isinstance(raw, list):
        return raw
    return [raw]


def verify_proof_inference(context: dict[str, Any] | None, critical_classes: set[str]) -> ProofVerificationResult:
    """Detect deterministic proof attacks from the active proof context."""

    if context is None:
        return ProofVerificationResult(
            status=ProofStatus.UNKNOWN,
            reason="PROOF_CONTEXT_UNAVAILABLE",
            evidence={"missing": "proof_context"},
        )

    proof_class = str(context.get("proof_class", "default"))
    assumptions = _normalize_assumptions(context.get("assumptions"))
    required_assumptions = _normalize_assumptions(context.get("required_assumptions"))
    bounds = context.get("bounds") or {}
    projection = context.get("projection") or {}
    feasible = context.get("feasible")

    missing = [key for key in required_assumptions if key not in assumptions]
    if missing:
        reason = "MISSING_ASSUMPTIONS"
        return ProofVerificationResult(
            status=ProofStatus.INVALID,
            reason=reason,
            evidence={
                "proof_class": proof_class,
                "missing_assumptions": missing,
                "required_assumptions": required_assumptions,
                "assumptions": assumptions,
            },
            hard_fail_eligible=proof_class in critical_classes,
        )

    lower = bounds.get("lower")
    upper = bounds.get("upper")
    value = bounds.get("value")
    if all(v is not None for v in (lower, upper, value)):
        if not (lower <= value <= upper):
            reason = "BOUND_VIOLATION"
            return ProofVerificationResult(
                status=ProofStatus.INVALID,
                reason=reason,
                evidence={
                    "proof_class": proof_class,
                    "lower": lower,
                    "upper": upper,
                    "value": value,
                },
                hard_fail_eligible=proof_class in critical_classes,
            )

    source_dim = projection.get("source_dim")
    target_dim = projection.get("target_dim")
    matrix_rank = projection.get("matrix_rank")
    if all(v is not None for v in (source_dim, target_dim, matrix_rank)):
        inconsistent = matrix_rank > min(source_dim, target_dim)
        if inconsistent:
            reason = "PROJECTION_INCONSISTENCY"
            return ProofVerificationResult(
                status=ProofStatus.INVALID,
                reason=reason,
                evidence={
                    "proof_class": proof_class,
                    "source_dim": source_dim,
                    "target_dim": target_dim,
                    "matrix_rank": matrix_rank,
                },
                hard_fail_eligible=proof_class in critical_classes,
            )

    objective = context.get("objective")
    if feasible is False:
        if objective is not None and isinstance(objective, (int, float)) and math.isfinite(objective):
            reason = "INFEASIBLE_EDGE_CASE"
            return ProofVerificationResult(
                status=ProofStatus.INVALID,
                reason=reason,
                evidence={
                    "proof_class": proof_class,
                    "feasible": feasible,
                    "objective": objective,
                },
                hard_fail_eligible=proof_class in critical_classes,
            )
        return ProofVerificationResult(
            status=ProofStatus.UNKNOWN,
            reason="INFEASIBLE_WITHOUT_OBJECTIVE_PROOF",
            evidence={"proof_class": proof_class, "feasible": feasible},
        )

    return ProofVerificationResult(
        status=ProofStatus.VALID,
        reason="PROOF_VALID",
        evidence={"proof_class": proof_class},
    )
