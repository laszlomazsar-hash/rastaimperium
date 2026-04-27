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
class PolicyState:
    """Deterministic policy evaluation inputs used for governance diagnostics."""

    rules_evaluated: int
    rules_matched: int
    violations: int
    escalations: int


class ComplianceEngine:
    """Article II-IV observability + audit logging + rollback triggers."""

    CONFIDENCE_FORMULA_VERSION = "policy_confidence.v1"

    def __init__(self) -> None:
        self._audit_log: List[AuditRecord] = []
        self._trace_coverage: Dict[str, float] = {f"L{i}": 100.0 for i in range(1, 10)}

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

    def compute_governance_diagnostics(self, policy_state: PolicyState) -> Dict[str, object]:
        """
        Build a replay-safe diagnostics payload from policy-state inputs only.

        Confidence formula (v1):
        0.70 * match_rate + 0.20 * compliance_rate + 0.10 * non_escalation_rate
        where:
          - match_rate = rules_matched / rules_evaluated
          - compliance_rate = 1 - (violations / rules_evaluated)
          - non_escalation_rate = 1 - (escalations / rules_evaluated)
        """

        evaluated = max(0, policy_state.rules_evaluated)
        matched = min(max(0, policy_state.rules_matched), evaluated)
        violations = min(max(0, policy_state.violations), evaluated)
        escalations = min(max(0, policy_state.escalations), evaluated)

        if evaluated == 0:
            confidence = 0.0
            match_rate = 0.0
        else:
            match_rate = matched / evaluated
            compliance_rate = 1.0 - (violations / evaluated)
            non_escalation_rate = 1.0 - (escalations / evaluated)
            confidence = (
                (0.70 * match_rate)
                + (0.20 * compliance_rate)
                + (0.10 * non_escalation_rate)
            )

        confidence = round(max(0.0, min(1.0, confidence)), 6)
        strength = self._rule_match_strength(match_rate)
        payload = {
            "policy_state": {
                "rules_evaluated": evaluated,
                "rules_matched": matched,
                "violations": violations,
                "escalations": escalations,
            },
            "diagnostics": {
                "confidence": confidence,
                "rule_match_strength": strength,
            },
            "policy_metadata": {
                "confidence_formula_version": self.CONFIDENCE_FORMULA_VERSION,
                "confidence_formula": (
                    "0.70*match_rate + 0.20*compliance_rate + 0.10*non_escalation_rate"
                ),
            },
        }
        return payload

    def _rule_match_strength(self, match_rate: float) -> str:
        if match_rate >= 0.9:
            return "high"
        if match_rate >= 0.7:
            return "moderate"
        if match_rate >= 0.4:
            return "low"
        return "minimal"

    @property
    def audit_log(self) -> List[AuditRecord]:
        return list(self._audit_log)
