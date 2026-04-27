from __future__ import annotations

import hashlib
import json
import os
from dataclasses import dataclass
from datetime import datetime, timezone
from enum import Enum
from typing import Dict, List


@dataclass
class AuditRecord:
    actor: str
    action: str
    article: str
    metadata: Dict[str, object]
    timestamp: str
    digest: str


class ReproducibilityProfile(str, Enum):
    BITWISE = "bitwise"
    NUMERIC_TOLERANCE = "numeric-tolerance"
    STATISTICAL = "statistical"


@dataclass(frozen=True)
class ProfileConstraint:
    key: str
    required: str


@dataclass(frozen=True)
class ReproducibilityProfileSpec:
    tier: ReproducibilityProfile
    execution_guarantee: str
    environment_constraints: List[ProfileConstraint]
    acceptance_rules: Dict[str, float]


@dataclass(frozen=True)
class ReplayResult:
    hash_match: bool
    max_abs_error: float
    p_value: float


PROFILE_SPECS: Dict[ReproducibilityProfile, ReproducibilityProfileSpec] = {
    ReproducibilityProfile.BITWISE: ReproducibilityProfileSpec(
        tier=ReproducibilityProfile.BITWISE,
        execution_guarantee="Identical bytes across replay runs.",
        environment_constraints=[
            ProfileConstraint("container_digest_pinned", "true"),
            ProfileConstraint("cpu_arch", "x86_64"),
            ProfileConstraint("deterministic_kernels", "enabled"),
            ProfileConstraint("rng_seed", "fixed"),
        ],
        acceptance_rules={"max_abs_error": 0.0, "min_p_value": 1.0},
    ),
    ReproducibilityProfile.NUMERIC_TOLERANCE: ReproducibilityProfileSpec(
        tier=ReproducibilityProfile.NUMERIC_TOLERANCE,
        execution_guarantee="Numerically stable replay within bounded floating-point drift.",
        environment_constraints=[
            ProfileConstraint("container_digest_pinned", "true"),
            ProfileConstraint("cpu_arch", "x86_64|arm64"),
            ProfileConstraint("precision", "fp32_or_fp64"),
            ProfileConstraint("rng_seed", "fixed"),
        ],
        acceptance_rules={"max_abs_error": 1e-6, "min_p_value": 0.99},
    ),
    ReproducibilityProfile.STATISTICAL: ReproducibilityProfileSpec(
        tier=ReproducibilityProfile.STATISTICAL,
        execution_guarantee="Distributional equivalence across replay cohorts.",
        environment_constraints=[
            ProfileConstraint("container_digest_pinned", "recommended"),
            ProfileConstraint("rng_seed", "tracked"),
            ProfileConstraint("sample_size_min", "30"),
        ],
        acceptance_rules={"max_abs_error": 1e-3, "min_p_value": 0.95},
    ),
}


class ComplianceEngine:
    """Article II-IV observability + audit logging + rollback triggers."""

    def __init__(self) -> None:
        self._audit_log: List[AuditRecord] = []
        self._trace_coverage: Dict[str, float] = {f"L{i}": 100.0 for i in range(1, 10)}
        self._active_profile = self._resolve_active_profile()

    def _resolve_active_profile(self) -> ReproducibilityProfile:
        raw = os.getenv("REPRODUCIBILITY_PROFILE", ReproducibilityProfile.NUMERIC_TOLERANCE.value)
        try:
            return ReproducibilityProfile(raw)
        except ValueError:
            return ReproducibilityProfile.NUMERIC_TOLERANCE

    def append_audit_record(self, actor: str, action: str, article: str, metadata: Dict[str, object]) -> AuditRecord:
        timestamp = datetime.now(timezone.utc).isoformat()
        payload = {
            "actor": actor,
            "action": action,
            "article": article,
            "metadata": metadata,
            "timestamp": timestamp,
        }
        digest = hashlib.sha256(json.dumps(payload, sort_keys=True).encode("utf-8")).hexdigest()
        record = AuditRecord(**payload, digest=digest)
        self._audit_log.append(record)
        return record

    def set_trace_coverage(self, layer: str, coverage: float) -> None:
        self._trace_coverage[layer] = max(0.0, min(100.0, coverage))

    def trace_coverage_graph(self) -> List[Dict[str, float]]:
        return [{"layer": layer, "coverage": value} for layer, value in sorted(self._trace_coverage.items())]

    def should_trigger_rollback(self) -> bool:
        return any(v < 80.0 for v in self._trace_coverage.values())

    def evaluate_replay_acceptance(self, replay: ReplayResult) -> dict[str, object]:
        spec = PROFILE_SPECS[self._active_profile]
        if self._active_profile is ReproducibilityProfile.BITWISE:
            accepted = replay.hash_match and replay.max_abs_error == 0.0
        elif self._active_profile is ReproducibilityProfile.NUMERIC_TOLERANCE:
            accepted = replay.max_abs_error <= spec.acceptance_rules["max_abs_error"] and replay.hash_match
        else:
            accepted = replay.p_value >= spec.acceptance_rules["min_p_value"]

        return {
            "profile": self._active_profile.value,
            "accepted": accepted,
            "rules": spec.acceptance_rules,
            "replay": {
                "hash_match": replay.hash_match,
                "max_abs_error": replay.max_abs_error,
                "p_value": replay.p_value,
            },
        }

    def runtime_diagnostics(self) -> dict[str, object]:
        spec = PROFILE_SPECS[self._active_profile]
        return {
            "active_profile": self._active_profile.value,
            "execution_guarantee": spec.execution_guarantee,
            "environment_constraints": [
                {"key": constraint.key, "required": constraint.required}
                for constraint in spec.environment_constraints
            ],
        }

    @property
    def audit_log(self) -> List[AuditRecord]:
        return list(self._audit_log)
