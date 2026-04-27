from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from random import uniform
from typing import Callable, Dict, List, Literal


@dataclass
class LayerMetric:
    layer: int
    coherence: float


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
class SoulEchoSnapshot:
    timestamp: str
    livity_score: float
    vibration_score: float
    transport_metric_mode: TransportMetricMode
    layer_metrics: List[LayerMetric] = field(default_factory=list)
    mutation_events: List[str] = field(default_factory=list)


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
    """Generates real-time friendly snapshot payloads for UI websocket streams."""

    def __init__(self, budget_state_provider: Callable[[int], TransportBudgetState] | None = None) -> None:
        self._base_layer_score: Dict[int, float] = {layer: 95.0 for layer in range(1, 10)}
        self._event_count = 0
        self._tick = 0
        self._transport_mode_telemetry: List[TransportModeDecision] = []
        self._budget_state_provider = budget_state_provider or self._default_budget_state_provider

    def _default_budget_state_provider(self, _: int) -> TransportBudgetState:
        return TransportBudgetState(tick_budget_class=2, queue_depth=0, configured_cap=10)

    def next_snapshot(self) -> SoulEchoSnapshot:
        self._tick += 1
        layer_metrics: List[LayerMetric] = []

        for layer, score in self._base_layer_score.items():
            updated = max(0.0, min(100.0, score + uniform(-1.5, 1.5)))
            self._base_layer_score[layer] = updated
            layer_metrics.append(LayerMetric(layer=layer, coherence=round(updated, 2)))

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
        vibration = round(max(0.0, min(100.0, livity + uniform(-2.0, 2.0))), 2)
        event = f"EVO-V mutation event #{self._event_count}"

        return SoulEchoSnapshot(
            timestamp=datetime.now(timezone.utc).isoformat(),
            livity_score=livity,
            vibration_score=vibration,
            transport_metric_mode=selected_mode,
            layer_metrics=layer_metrics,
            mutation_events=[event],
        )

    def transport_mode_telemetry(self) -> List[TransportModeDecision]:
        return list(self._transport_mode_telemetry)
