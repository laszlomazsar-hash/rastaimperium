"""Deterministic governance policy based on belief geometry."""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any, Dict, List, Optional, Tuple


@dataclass(frozen=True)
class BeliefGeometry:
    """Posterior-space features used by governance policy."""

    entropy: float
    concentration: float
    contradiction: float


@dataclass(frozen=True)
class ActionRegion:
    """Axis-aligned region in posterior feature space."""

    name: str
    action: str
    mode: str
    entropy_range: Tuple[float, float]
    concentration_range: Tuple[float, float]
    contradiction_range: Tuple[float, float]
    min_confidence: float = 0.0
    priority: int = 0

    def contains(self, geometry: BeliefGeometry) -> bool:
        return (
            self.entropy_range[0] <= geometry.entropy <= self.entropy_range[1]
            and self.concentration_range[0] <= geometry.concentration <= self.concentration_range[1]
            and self.contradiction_range[0] <= geometry.contradiction <= self.contradiction_range[1]
        )


@dataclass(frozen=True)
class SafetyEnvelope:
    """Hard constraints that supersede posterior-conditioned action selection."""

    allowed_actions: Tuple[str, ...]
    max_entropy: float
    max_contradiction: float
    min_concentration: float
    fallback_action: str = "hold"
    fallback_mode: str = "safe"

    def enforce(self, geometry: BeliefGeometry, action: str, mode: str) -> Tuple[str, str, bool]:
        is_safe = (
            action in self.allowed_actions
            and geometry.entropy <= self.max_entropy
            and geometry.contradiction <= self.max_contradiction
            and geometry.concentration >= self.min_concentration
        )
        if is_safe:
            return action, mode, False
        return self.fallback_action, self.fallback_mode, True


@dataclass(frozen=True)
class GovernanceDecision:
    mode: str
    action: str
    confidence: float
    region: Optional[str]
    gate_reason: Optional[str] = None
    safety_override: bool = False


class BeliefGeometryGovernancePolicy:
    """Deterministic policy for selecting governance actions."""

    def __init__(
        self,
        regions: List[ActionRegion],
        safety_envelope: SafetyEnvelope,
        confidence_gate: float = 0.6,
        hysteresis_delta: float = 0.1,
    ) -> None:
        self.regions = sorted(regions, key=lambda region: region.priority, reverse=True)
        self.safety_envelope = safety_envelope
        self.confidence_gate = confidence_gate
        self.hysteresis_delta = hysteresis_delta
        self._last_decision: Optional[GovernanceDecision] = None
        self._decision_log: List[Dict[str, Any]] = []

    def decide(self, geometry: BeliefGeometry) -> GovernanceDecision:
        region = self._select_region(geometry)
        base_action = self.safety_envelope.fallback_action
        base_mode = self.safety_envelope.fallback_mode
        confidence = self._compute_confidence(geometry)
        gate_reason: Optional[str] = None

        if region is not None:
            base_action = region.action
            base_mode = region.mode
            confidence = max(confidence, region.min_confidence)

        if confidence < self.confidence_gate:
            base_action = self.safety_envelope.fallback_action
            base_mode = self.safety_envelope.fallback_mode
            gate_reason = "confidence_gate"

        if self._last_decision is not None and base_mode != self._last_decision.mode:
            if abs(confidence - self._last_decision.confidence) < self.hysteresis_delta:
                base_mode = self._last_decision.mode
                base_action = self._last_decision.action
                gate_reason = "hysteresis"

        action, mode, safety_override = self.safety_envelope.enforce(geometry, base_action, base_mode)
        decision = GovernanceDecision(
            mode=mode,
            action=action,
            confidence=round(confidence, 6),
            region=region.name if region else None,
            gate_reason=gate_reason,
            safety_override=safety_override,
        )
        self._last_decision = decision
        self._log_decision(geometry, decision)
        return decision

    def replay(self, decision_log: List[Dict[str, Any]]) -> List[GovernanceDecision]:
        replayed: List[GovernanceDecision] = []
        self.reset()
        for entry in decision_log:
            geometry = BeliefGeometry(**entry["input"])
            replayed.append(self.decide(geometry))
        return replayed

    def reset(self) -> None:
        self._last_decision = None
        self._decision_log = []

    @property
    def decision_log(self) -> List[Dict[str, Any]]:
        return list(self._decision_log)

    def _select_region(self, geometry: BeliefGeometry) -> Optional[ActionRegion]:
        for region in self.regions:
            if region.contains(geometry):
                return region
        return None

    def _compute_confidence(self, geometry: BeliefGeometry) -> float:
        confidence = 1.0 - (0.5 * geometry.entropy + 0.3 * geometry.contradiction)
        confidence += 0.2 * geometry.concentration
        return max(0.0, min(1.0, confidence))

    def _log_decision(self, geometry: BeliefGeometry, decision: GovernanceDecision) -> None:
        self._decision_log.append(
            {
                "event_index": len(self._decision_log),
                "input": asdict(geometry),
                "decision": asdict(decision),
            }
        )


DEFAULT_REGIONS: List[ActionRegion] = [
    ActionRegion(
        name="stable_autonomy",
        action="proceed",
        mode="autonomous",
        entropy_range=(0.0, 0.35),
        concentration_range=(0.65, 1.0),
        contradiction_range=(0.0, 0.25),
        min_confidence=0.75,
        priority=20,
    ),
    ActionRegion(
        name="review_required",
        action="request_review",
        mode="supervised",
        entropy_range=(0.2, 0.8),
        concentration_range=(0.25, 0.8),
        contradiction_range=(0.15, 0.7),
        min_confidence=0.55,
        priority=10,
    ),
]

DEFAULT_SAFETY_ENVELOPE = SafetyEnvelope(
    allowed_actions=("proceed", "request_review", "hold"),
    max_entropy=0.9,
    max_contradiction=0.85,
    min_concentration=0.15,
    fallback_action="hold",
    fallback_mode="safe",
)

DEFAULT_POLICY = BeliefGeometryGovernancePolicy(
    regions=DEFAULT_REGIONS,
    safety_envelope=DEFAULT_SAFETY_ENVELOPE,
)


def validate_action(action: str) -> bool:
    """Compatibility helper used by legacy engine entrypoints."""

    decision = DEFAULT_POLICY.decide(BeliefGeometry(entropy=0.2, concentration=0.7, contradiction=0.1))
    return action in DEFAULT_SAFETY_ENVELOPE.allowed_actions and decision.action != "hold"
