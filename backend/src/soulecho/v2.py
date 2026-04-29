from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from typing import Callable, Dict, List, Literal

from .metrics import EnergyComponentBreakdown, compute_energy_breakdown

from .metrics import METRIC_SCHEMA_VERSION, energy_from_runtime_snapshot

@dataclass
class LayerMetric:
    layer: int
    coherence: float
    predictive_mean: float
    drift_i: float = 0.0


TransportMetricMode = Literal["realtime", "batched", "deferred"]


@dataclass(frozen=True)
class TransportBudgetState:
    tick_budget_class: int
    queue_depth: int
    configured_cap: int


@dataclass(frozen=True)
class TransportModeDecision:
    tick: int
    budget_state: TransportBudgetState
    mode: TransportMetricMode


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
    metric_schema_version: str
    livity_score: float
    vibration_score: float
    transport_metric_mode: TransportMetricMode
    layer_metrics: List[LayerMetric] = field(default_factory=list)
    mutation_events: List[str] = field(default_factory=list)
    policy_deltas: List[PolicyDelta] = field(default_factory=list)
    policy_threshold: float = 80.0
    energy_schema_version: str = METRIC_SCHEMA_VERSION
    energy_components: EnergyComponentBreakdown | None = None


def choose_transport_metric_mode(state: TransportBudgetState) -> TransportMetricMode:
    """
    Choose the transport mode from explicit measured counters.

    Tie-breaks are deterministic by applying a fixed mode priority when two
    candidates produce identical penalty scores.
    """
    if state.configured_cap <= 0:
        return "deferred"

    queue_depth = max(state.queue_depth, 0)
    cap = state.configured_cap
    budget_class = max(state.tick_budget_class, 0)

    candidate_cost: dict[TransportMetricMode, tuple[int, int]] = {
        "realtime": (
            max(0, 2 - budget_class) + max(0, queue_depth - int(cap * 0.50)),
            0,
        ),
        "batched": (
            max(0, 1 - budget_class) + max(0, int(cap * 0.25) - queue_depth) + max(0, queue_depth - int(cap * 0.90)),
            1,
        ),
        "deferred": (
            max(0, int(cap * 0.75) - queue_depth),
            2,
        ),
    }

    return min(candidate_cost.items(), key=lambda item: item[1])[0]


class SoulEchoStreamEngine:
    """Generates deterministic snapshot payloads for UI websocket streams."""

    def __init__(
        self,
        *,
        budget_state_provider: Callable[[int], TransportBudgetState] | None = None,
        policy_update_interval_seconds: int = 60,
        ema_alpha: float = 0.25,
        delta_limit: float = 1.0,
        hysteresis_band: float = 0.2,
        cooldown_seconds: int = 120,
    ) -> None:
        self._base_layer_score: Dict[int, float] = {layer: 95.0 for layer in range(1, 10)}
        self._event_count = 0
        self._tick = 0
        self._transport_mode_telemetry: List[TransportModeDecision] = []
        self._budget_state_provider = budget_state_provider or self._default_budget_state_provider
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

    def _default_budget_state_provider(self, _: int) -> TransportBudgetState:
        return TransportBudgetState(tick_budget_class=2, queue_depth=0, configured_cap=10)

    @staticmethod
    def _delta(*, step: int, layer: int) -> float:
        """Deterministic bounded layer drift used for replay-stable snapshots."""
        phase = (step * 17 + layer * 13) % 11
        return float(phase - 5) * 0.1

    def next_snapshot(self, now: datetime | None = None) -> SoulEchoSnapshot:
        timestamp = now or datetime.now(timezone.utc)
        layer_metrics: List[LayerMetric] = []
        predicted_scores: List[float] = []
        actual_scores: List[float] = []

        step = self._event_count + 1
        for layer, score in self._base_layer_score.items():
            predicted_scores.append(score)
            updated = max(0.0, min(100.0, score + self._delta(step=step, layer=layer)))
            self._base_layer_score[layer] = updated
            actual_scores.append(updated)
            layer_metrics.append(LayerMetric(layer=layer, coherence=round(updated, 2), predictive_mean=round(score, 2)))

        self._event_count += 1
        budget_state = self._budget_state_provider(self._tick)
        selected_mode = choose_transport_metric_mode(budget_state)
        self._transport_mode_telemetry.append(
            TransportModeDecision(
                tick=self._tick,
                budget_state=budget_state,
                mode=selected_mode,
            )
        )
        livity = round(sum(item.coherence for item in layer_metrics) / len(layer_metrics), 2)
        vibration = round(max(0.0, min(100.0, livity + self._delta(step=step, layer=0))), 2)
        snapshot_drift = round(abs(vibration - livity), 2)
        for metric in layer_metrics:
            metric.drift_i = round(abs(snapshot_drift - metric.predictive_mean), 2)
        energy_components = compute_energy_breakdown(actual_scores=actual_scores, predicted_scores=predicted_scores)
        energy_score = energy_from_runtime_snapshot(snapshot_drift=snapshot_drift, hypotheses=layer_metrics)
        event = f"EVO-V mutation event #{self._event_count}"

        self._pending_baseline_writes += 1
        policy_deltas = self._update_policy_if_due(self._policy_signal(livity), timestamp)
        self._tick += 1

        return SoulEchoSnapshot(
            timestamp=timestamp.isoformat(),
            metric_schema_version=METRIC_SCHEMA_VERSION,
            livity_score=livity,
            vibration_score=vibration,
            transport_metric_mode=selected_mode,
            layer_metrics=layer_metrics,
            mutation_events=[event],
            policy_deltas=policy_deltas,
            policy_threshold=round(self._policy_threshold, 3),
            energy_components=energy_components,
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

    def transport_mode_telemetry(self) -> List[TransportModeDecision]:
        return list(self._transport_mode_telemetry)
