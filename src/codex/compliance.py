from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Dict, List


@dataclass
class AuditRecord:
    actor: str
    action: str
    article: str
    metadata: Dict[str, object]
    timestamp: str
    digest: str


@dataclass(frozen=True)
class FaultModel:
    admissible_domain: str
    excluded_fault_classes: List[str]
    collapse_resistance_theorem: str
    theorem_assumptions: List[str]


@dataclass(frozen=True)
class IntegrityViolation:
    code: str
    message: str


class ComplianceEngine:
    """Article II-IV observability + audit logging + rollback triggers."""

    def __init__(self) -> None:
        self._audit_log: List[AuditRecord] = []
        self._trace_coverage: Dict[str, float] = {f"L{i}": 100.0 for i in range(1, 10)}
        self._persisted_state_digest: str | None = None
        self._policy_digest: str | None = None
        self._last_integrity_violations: List[IntegrityViolation] = []
        self._fault_model = FaultModel(
            admissible_domain="Deterministic execution with trusted storage, trusted memory, and immutable policy root.",
            excluded_fault_classes=[
                "disk_corruption",
                "arbitrary_memory_mutation",
                "policy_tampering",
            ],
            collapse_resistance_theorem=(
                "Collapse resistance is guaranteed only while executions remain in the admissible domain and "
                "integrity checks report no violations."
            ),
            theorem_assumptions=[
                "Persistent state is cryptographically consistent with baseline digest.",
                "Active policy payload is cryptographically consistent with baseline digest.",
                "Excluded fault classes are outside this model and treated as violations if detected.",
            ],
        )

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
        if self._last_integrity_violations:
            return True
        return any(v < 80.0 for v in self._trace_coverage.values())

    def capture_integrity_baseline(self, persisted_state: Dict[str, object], policy: Dict[str, object]) -> None:
        self._persisted_state_digest = self._digest_payload(persisted_state)
        self._policy_digest = self._digest_payload(policy)
        self._last_integrity_violations = []

    def validate_integrity(self, persisted_state: Dict[str, object], policy: Dict[str, object]) -> List[IntegrityViolation]:
        violations: List[IntegrityViolation] = []

        if self._persisted_state_digest is None or self._policy_digest is None:
            violations.append(
                IntegrityViolation(
                    code="integrity_baseline_missing",
                    message="Integrity baseline has not been captured for persisted state/policy.",
                )
            )
        else:
            if self._digest_payload(persisted_state) != self._persisted_state_digest:
                violations.append(
                    IntegrityViolation(
                        code="persisted_state_integrity_failure",
                        message="Persisted state digest mismatch; outside admissible domain.",
                    )
                )
            if self._digest_payload(policy) != self._policy_digest:
                violations.append(
                    IntegrityViolation(
                        code="policy_integrity_failure",
                        message="Policy digest mismatch; possible policy tampering.",
                    )
                )

        self._last_integrity_violations = violations
        return list(violations)

    def observability_status(self) -> Dict[str, object]:
        return {
            "fault_model": {
                "admissible_domain": self._fault_model.admissible_domain,
                "excluded_fault_classes": self._fault_model.excluded_fault_classes,
            },
            "collapse_resistance": {
                "theorem": self._fault_model.collapse_resistance_theorem,
                "assumptions": self._fault_model.theorem_assumptions,
                "valid": not self._last_integrity_violations,
            },
            "integrity": {
                "baseline_captured": self._persisted_state_digest is not None and self._policy_digest is not None,
                "violation_count": len(self._last_integrity_violations),
                "violations": [
                    {"code": violation.code, "message": violation.message}
                    for violation in self._last_integrity_violations
                ],
            },
        }

    @staticmethod
    def _digest_payload(payload: Dict[str, object]) -> str:
        return hashlib.sha256(json.dumps(payload, sort_keys=True).encode("utf-8")).hexdigest()

    @property
    def audit_log(self) -> List[AuditRecord]:
        return list(self._audit_log)
