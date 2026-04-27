from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Callable, Dict, List, Sequence


@dataclass
class AuditRecord:
    actor: str
    action: str
    article: str
    metadata: Dict[str, object]
    timestamp: str
    digest: str


@dataclass(frozen=True)
class Perturbation:
    id: str
    description: str
    impact_weight: float


@dataclass(frozen=True)
class ViolationFinding:
    perturbation_id: str
    severity_score: float
    confidence: float
    reason: str


@dataclass(frozen=True)
class AdversarialVerificationTick:
    tick: int
    invariant_class: str
    tested_perturbations: List[str]
    violations: List[ViolationFinding]
    worst_case_candidate: ViolationFinding | None


class ComplianceEngine:
    """Article II-IV observability + audit logging + rollback triggers."""

    def __init__(self) -> None:
        self._audit_log: List[AuditRecord] = []
        self._trace_coverage: Dict[str, float] = {f"L{i}": 100.0 for i in range(1, 10)}
        self._max_perturbations_per_tick = 3
        self._verification_log: List[AdversarialVerificationTick] = []
        self._perturbation_catalog: Dict[str, List[Perturbation]] = {
            "trace_coverage": [
                Perturbation(
                    id="coverage_drop_l2",
                    description="Drop layer L2 coverage by 20 points.",
                    impact_weight=0.8,
                ),
                Perturbation(
                    id="coverage_drop_l5",
                    description="Drop layer L5 coverage by 10 points.",
                    impact_weight=0.5,
                ),
                Perturbation(
                    id="coverage_spike_l8",
                    description="Spike layer L8 coverage and validate normalization.",
                    impact_weight=0.2,
                ),
            ],
            "rollback_guard": [
                Perturbation(
                    id="rollback_threshold_boundary",
                    description="Set one layer exactly at rollback threshold.",
                    impact_weight=0.6,
                ),
                Perturbation(
                    id="multi_layer_degradation",
                    description="Degrade multiple layers below threshold.",
                    impact_weight=0.9,
                ),
            ],
            "audit_integrity": [
                Perturbation(
                    id="metadata_order_shuffle",
                    description="Change metadata key order and verify digest stability.",
                    impact_weight=0.4,
                ),
                Perturbation(
                    id="actor_impersonation",
                    description="Attempt actor spoofing in audit payload.",
                    impact_weight=0.9,
                ),
            ],
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

    def set_max_perturbations_per_tick(self, limit: int) -> None:
        if limit <= 0:
            raise ValueError("max perturbations per tick must be > 0")
        self._max_perturbations_per_tick = limit

    def set_perturbation_catalog(self, invariant_class: str, perturbations: Sequence[Perturbation]) -> None:
        if not perturbations:
            raise ValueError("perturbation catalog must be finite and non-empty")
        canonical = sorted(perturbations, key=lambda p: p.id)
        self._perturbation_catalog[invariant_class] = list(canonical)

    def run_adversarial_verification(
        self,
        *,
        invariant_class: str,
        tick: int,
        max_perturbations: int | None = None,
        evaluator: Callable[[Perturbation], ViolationFinding | None] | None = None,
    ) -> AdversarialVerificationTick:
        catalog = self._perturbation_catalog.get(invariant_class, [])
        ordered_catalog = sorted(catalog, key=lambda p: p.id)
        budget = self._max_perturbations_per_tick if max_perturbations is None else max_perturbations
        if budget <= 0:
            raise ValueError("max perturbations must be > 0")
        safe_budget = min(self._max_perturbations_per_tick, budget, len(ordered_catalog))
        selected = ordered_catalog[:safe_budget]

        violations: List[ViolationFinding] = []
        for perturbation in selected:
            finding = evaluator(perturbation) if evaluator is not None else self._evaluate_perturbation(perturbation)
            if finding is not None:
                violations.append(finding)

        worst_case = max(
            violations,
            key=lambda item: (item.severity_score, item.confidence, item.perturbation_id),
            default=None,
        )
        tick_report = AdversarialVerificationTick(
            tick=tick,
            invariant_class=invariant_class,
            tested_perturbations=[item.id for item in selected],
            violations=violations,
            worst_case_candidate=worst_case,
        )
        self._verification_log.append(tick_report)
        return tick_report

    def _evaluate_perturbation(self, perturbation: Perturbation) -> ViolationFinding | None:
        rollback_risk = 1.0 if self.should_trigger_rollback() else 0.0
        if perturbation.impact_weight < 0.7 and rollback_risk == 0.0:
            return None
        severity = round(min(1.0, perturbation.impact_weight * 0.75 + rollback_risk * 0.5), 3)
        confidence = round(min(1.0, 0.55 + perturbation.impact_weight * 0.45), 3)
        return ViolationFinding(
            perturbation_id=perturbation.id,
            severity_score=severity,
            confidence=confidence,
            reason="Simulated policy violation under deterministic perturbation.",
        )

    @property
    def audit_log(self) -> List[AuditRecord]:
        return list(self._audit_log)

    @property
    def verification_log(self) -> List[AdversarialVerificationTick]:
        return list(self._verification_log)
