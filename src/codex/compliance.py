from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from datetime import datetime, timezone
from enum import Enum
from typing import Dict, List


class InvariantTier(str, Enum):
    """Severity tiers for safety invariants."""

    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    INFORMATIONAL = "informational"


class EscalationPath(str, Enum):
    """Escalation paths emitted by the safety state machine."""

    IMMEDIATE_COMPROMISE = "immediate_compromise"
    STAGED_DEGRADATION = "staged_degradation"


@dataclass(frozen=True)
class SafetyTransition:
    """Represents a deterministic safety state transition decision."""

    previous_state: str
    next_state: str
    tier: InvariantTier
    escalation: EscalationPath
    rationale: str


@dataclass
class AuditRecord:
    actor: str
    action: str
    article: str
    metadata: Dict[str, object]
    timestamp: str
    digest: str


class ComplianceEngine:
    """Article II-IV observability + audit logging + rollback triggers."""

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

    def classify_invariant_tier(self, tier: str) -> InvariantTier:
        """Normalize invariant tiers to the canonical deterministic set."""

        normalized = tier.strip().lower().replace("-", "_").replace(" ", "_")
        alias_map = {
            "critical": InvariantTier.CRITICAL,
            "high": InvariantTier.HIGH,
            "medium": InvariantTier.MEDIUM,
            "informational": InvariantTier.INFORMATIONAL,
            "info": InvariantTier.INFORMATIONAL,
            "low": InvariantTier.INFORMATIONAL,
        }
        if normalized not in alias_map:
            raise ValueError(f"Unknown invariant tier: {tier}")
        return alias_map[normalized]

    def escalation_path_for_tier(self, tier: InvariantTier) -> EscalationPath:
        """Critical invariants compromise immediately; all other tiers degrade in stages."""

        if tier is InvariantTier.CRITICAL:
            return EscalationPath.IMMEDIATE_COMPROMISE
        return EscalationPath.STAGED_DEGRADATION

    def transition_safety_state(
        self,
        current_state: str,
        invariant_tier: InvariantTier | str,
        reason: str,
    ) -> SafetyTransition:
        """Create a deterministic safety transition with tier and escalation rationale."""

        tier = (
            self.classify_invariant_tier(invariant_tier)
            if isinstance(invariant_tier, str)
            else invariant_tier
        )
        escalation = self.escalation_path_for_tier(tier)

        if escalation is EscalationPath.IMMEDIATE_COMPROMISE:
            next_state = "COMPROMISE"
        else:
            next_state = "DEGRADED"

        rationale = (
            f"tier={tier.value}; escalation={escalation.value}; "
            f"decision={'critical violation => immediate compromise' if tier is InvariantTier.CRITICAL else 'non-critical violation => staged degradation'}; "
            f"reason={reason}"
        )

        return SafetyTransition(
            previous_state=current_state,
            next_state=next_state,
            tier=tier,
            escalation=escalation,
            rationale=rationale,
        )

    @property
    def audit_log(self) -> List[AuditRecord]:
        return list(self._audit_log)
