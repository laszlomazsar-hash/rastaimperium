from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from enum import Enum
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


class SafetyState(str, Enum):
    SAFE = "SAFE"
    DEGRADED = "DEGRADED"
    COMPROMISE = "COMPROMISE"


class EvidenceStatus(str, Enum):
    PASS = "PASS"
    FAIL = "FAIL"
    UNKNOWN = "UNKNOWN"


class ComplianceEngine:
    """Article II-IV observability + audit logging + rollback triggers."""

    def __init__(self) -> None:
        self._audit_log: List[AuditRecord] = []
        self._trace_coverage: Dict[str, float] = {f"L{i}": 100.0 for i in range(1, 10)}
        self._unknown_counts: Dict[str, int] = {}
        self._criticality_policy = {
            "low": SafetyState.SAFE,
            "medium": SafetyState.DEGRADED,
            "high": SafetyState.COMPROMISE,
        }
        self._unknown_thresholds = {
            "low": {"degraded": 3, "compromise": 5},
            "medium": {"degraded": 2, "compromise": 4},
            "high": {"degraded": 1, "compromise": 2},
        }

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

    def evaluate_invariant(
        self,
        invariant: str,
        criticality_tier: str,
        evidence_status: EvidenceStatus | str,
        cause_code: str | None = None,
        confidence: float | None = None,
    ) -> SafetyState:
        tier = criticality_tier.lower()
        if tier not in self._criticality_policy:
            raise ValueError(f"Unknown criticality tier: {criticality_tier}")
        status = EvidenceStatus(evidence_status)
        confidence_value = self._normalize_confidence(confidence)

        if status is EvidenceStatus.PASS:
            self._unknown_counts[invariant] = 0
            return SafetyState.SAFE
        if status is EvidenceStatus.FAIL:
            self._unknown_counts[invariant] = 0
            return SafetyState.COMPROMISE

        self._unknown_counts[invariant] = self._unknown_counts.get(invariant, 0) + 1
        unknown_count = self._unknown_counts[invariant]
        thresholds = self._unknown_thresholds[tier]
        if unknown_count >= thresholds["compromise"]:
            state = SafetyState.COMPROMISE
        elif unknown_count >= thresholds["degraded"]:
            state = SafetyState.DEGRADED
        else:
            state = self._criticality_policy[tier]

        self.append_audit_record(
            actor="ark_safety_engine",
            action="invariant_unknown_evidence",
            article="III",
            metadata={
                "invariant": invariant,
                "criticality_tier": tier,
                "evidence_status": status.value,
                "unknown_count": unknown_count,
                "cause_code": cause_code or "unspecified",
                "confidence": confidence_value,
                "resulting_state": state.value,
            },
        )
        return state

    @staticmethod
    def _normalize_confidence(confidence: float | None) -> float | None:
        if confidence is None:
            return None
        return max(0.0, min(1.0, confidence))

    @property
    def audit_log(self) -> List[AuditRecord]:
        return list(self._audit_log)
