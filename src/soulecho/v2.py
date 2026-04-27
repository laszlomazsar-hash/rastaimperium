from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from random import uniform
from typing import Dict, List


@dataclass
class LayerMetric:
    layer: int
    coherence: float


@dataclass
class PolicyDelta:
    timestamp: str
    previous_threshold: float
    new_threshold: float
    delta: float
    reason_code: str


@dataclass
class SoulEchoSnapshot:
    timestamp: str
    livity_score: float
    vibration_score: float
    layer_metrics: List[LayerMetric] = field(default_factory=list)
    mutation_events: List[str] = field(default_factory=list)
    policy_deltas: List[PolicyDelta] = field(default_factory=list)
    policy_threshold: float = 80.0


class SoulEchoStreamEngine:
    """Generates real-time friendly snapshot payloads for UI websocket streams."""

    def __init__(
        self,
        *,
        policy_update_interval_seconds: int = 60,
        ema_alpha: float = 0.25,
        delta_limit: float = 1.0,
        hysteresis_band: float = 0.2,
        cooldown_seconds: int = 120,
    ) -> None:
        self._base_layer_score: Dict[int, float] = {layer: 95.0 for layer in range(1, 10)}
        self._event_count = 0

        self._policy_update_interval = timedelta(seconds=policy_update_interval_seconds)
        self._ema_alpha = ema_alpha
        self._delta_limit = abs(delta_limit)
        self._hysteresis_band = abs(hysteresis_band)
        self._cooldown = timedelta(seconds=cooldown_seconds)

        self._policy_threshold = 80.0
        self._ema_target = self._policy_threshold
        self._last_policy_update_at: datetime | None = None
        self._last_direction_change_at: datetime | None = None
        self._last_direction = 0
        self._pending_baseline_writes = 0

    def next_snapshot(self, now: datetime | None = None) -> SoulEchoSnapshot:
        timestamp = now or datetime.now(timezone.utc)
        layer_metrics: List[LayerMetric] = []

        for layer, score in self._base_layer_score.items():
            updated = max(0.0, min(100.0, score + uniform(-1.5, 1.5)))
            self._base_layer_score[layer] = updated
            layer_metrics.append(LayerMetric(layer=layer, coherence=round(updated, 2)))

        self._event_count += 1
        livity = round(sum(item.coherence for item in layer_metrics) / len(layer_metrics), 2)
        vibration = round(max(0.0, min(100.0, livity + uniform(-2.0, 2.0))), 2)
        event = f"EVO-V mutation event #{self._event_count}"

        self._pending_baseline_writes += 1
        policy_deltas = self._update_policy_if_due(self._policy_signal(livity), timestamp)

        return SoulEchoSnapshot(
            timestamp=timestamp.isoformat(),
            livity_score=livity,
            vibration_score=vibration,
            layer_metrics=layer_metrics,
            mutation_events=[event],
            policy_deltas=policy_deltas,
            policy_threshold=round(self._policy_threshold, 3),
        )

    def _policy_signal(self, livity_score: float) -> float:
        return livity_score

    def _update_policy_if_due(self, livity_score: float, now: datetime) -> List[PolicyDelta]:
        if self._pending_baseline_writes == 0:
            return []

        if self._last_policy_update_at and now - self._last_policy_update_at < self._policy_update_interval:
            return []

        self._last_policy_update_at = now
        self._pending_baseline_writes = 0
        return [self._bounded_policy_step(livity_score, now)]

    def _bounded_policy_step(self, livity_score: float, now: datetime) -> PolicyDelta:
        raw_target = max(70.0, min(95.0, livity_score - 12.0))
        self._ema_target = (self._ema_alpha * raw_target) + ((1 - self._ema_alpha) * self._ema_target)

        previous = self._policy_threshold
        desired_delta = self._ema_target - previous
        clipped_delta = max(-self._delta_limit, min(self._delta_limit, desired_delta))

        if abs(clipped_delta) < self._hysteresis_band:
            return PolicyDelta(
                timestamp=now.isoformat(),
                previous_threshold=round(previous, 3),
                new_threshold=round(previous, 3),
                delta=0.0,
                reason_code="hysteresis_hold",
            )

        direction = 1 if clipped_delta > 0 else -1
        if (
            self._last_direction != 0
            and direction != self._last_direction
            and self._last_direction_change_at
            and now - self._last_direction_change_at < self._cooldown
        ):
            return PolicyDelta(
                timestamp=now.isoformat(),
                previous_threshold=round(previous, 3),
                new_threshold=round(previous, 3),
                delta=0.0,
                reason_code="cooldown_hold",
            )

        new_threshold = previous + clipped_delta
        if self._last_direction != direction:
            self._last_direction_change_at = now

        self._last_direction = direction
        self._policy_threshold = round(new_threshold, 3)

        reason = "bounded_step"
        if abs(clipped_delta) == self._delta_limit:
            reason = "delta_clamped"

        return PolicyDelta(
            timestamp=now.isoformat(),
            previous_threshold=round(previous, 3),
            new_threshold=round(self._policy_threshold, 3),
            delta=round(self._policy_threshold - previous, 3),
            reason_code=reason,
        )
