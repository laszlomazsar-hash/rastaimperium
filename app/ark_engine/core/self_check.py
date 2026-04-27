"""Self-check helpers for stability heuristics and attractor-condition verification."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, Iterable, List, Mapping


REQUIRED_ATTRACTOR_CONDITIONS: tuple[str, ...] = (
    "boundedness",
    "dissipativity",
    "continuity_like",
    "closed_map",
    "invariant_set",
)


@dataclass(frozen=True)
class ConditionArtifact:
    """Verification artifact for a single attractor-existence condition."""

    condition: str
    proven: bool
    empirically_observed: bool
    evidence: str

    @property
    def status(self) -> str:
        if self.proven:
            return "proven"
        if self.empirically_observed:
            return "empirical_only"
        return "unverified"


def self_check(memory: Any) -> str:
    if memory.stability < 0.6:
        return "recover"
    if memory.stability > 1.2:
        return "expand"
    return "steady"


def attractor_existence_statement(assumptions: str = "A..N") -> str:
    """Return a cautious claim that avoids overstated guarantees."""
    return (
        f"Under assumptions {assumptions}, attractor existence follows from "
        "boundedness + dissipativity + continuity-like conditions."
    )


def required_attractor_conditions() -> tuple[str, ...]:
    """Return all conditions that must be checked before claiming proof."""
    return REQUIRED_ATTRACTOR_CONDITIONS


def build_condition_artifacts(
    observations: Mapping[str, Mapping[str, Any]],
) -> List[ConditionArtifact]:
    """Build per-condition artifacts documenting proofs vs empirical evidence.

    Each observation item can include:
    - proven: bool
    - empirically_observed: bool
    - evidence: str
    """
    artifacts: List[ConditionArtifact] = []
    for condition in REQUIRED_ATTRACTOR_CONDITIONS:
        payload = observations.get(condition, {})
        artifacts.append(
            ConditionArtifact(
                condition=condition,
                proven=bool(payload.get("proven", False)),
                empirically_observed=bool(payload.get("empirically_observed", False)),
                evidence=str(payload.get("evidence", "")),
            )
        )
    return artifacts


def summarize_attractor_verification(artifacts: Iterable[ConditionArtifact]) -> Dict[str, Any]:
    """Summarize what is proven versus empirically observed."""
    artifact_list = list(artifacts)
    proven_conditions = [a.condition for a in artifact_list if a.proven]
    empirical_only_conditions = [
        a.condition for a in artifact_list if (not a.proven and a.empirically_observed)
    ]
    missing_conditions = [a.condition for a in artifact_list if a.status == "unverified"]

    fully_proven = len(proven_conditions) == len(REQUIRED_ATTRACTOR_CONDITIONS)
    return {
        "statement": attractor_existence_statement(),
        "required_conditions": list(REQUIRED_ATTRACTOR_CONDITIONS),
        "proven_conditions": proven_conditions,
        "empirical_only_conditions": empirical_only_conditions,
        "missing_conditions": missing_conditions,
        "attractor_existence_proven": fully_proven,
        "note": (
            "Proof-level claim is valid only when all required conditions are proven; "
            "otherwise treat results as empirical observations."
        ),
        "artifacts": [
            {
                "condition": a.condition,
                "status": a.status,
                "proven": a.proven,
                "empirically_observed": a.empirically_observed,
                "evidence": a.evidence,
            }
            for a in artifact_list
        ],
    }
