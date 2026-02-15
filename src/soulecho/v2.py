from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from random import uniform
from typing import Dict, List


@dataclass
class LayerMetric:
    layer: int
    coherence: float


@dataclass
class SoulEchoSnapshot:
    timestamp: str
    livity_score: float
    vibration_score: float
    layer_metrics: List[LayerMetric] = field(default_factory=list)
    mutation_events: List[str] = field(default_factory=list)


class SoulEchoStreamEngine:
    """Generates real-time friendly snapshot payloads for UI websocket streams."""

    def __init__(self) -> None:
        self._base_layer_score: Dict[int, float] = {layer: 95.0 for layer in range(1, 10)}
        self._event_count = 0

    def next_snapshot(self) -> SoulEchoSnapshot:
        layer_metrics: List[LayerMetric] = []

        for layer, score in self._base_layer_score.items():
            updated = max(0.0, min(100.0, score + uniform(-1.5, 1.5)))
            self._base_layer_score[layer] = updated
            layer_metrics.append(LayerMetric(layer=layer, coherence=round(updated, 2)))

        self._event_count += 1
        livity = round(sum(item.coherence for item in layer_metrics) / len(layer_metrics), 2)
        vibration = round(max(0.0, min(100.0, livity + uniform(-2.0, 2.0))), 2)
        event = f"EVO-V mutation event #{self._event_count}"

        return SoulEchoSnapshot(
            timestamp=datetime.now(timezone.utc).isoformat(),
            livity_score=livity,
            vibration_score=vibration,
            layer_metrics=layer_metrics,
            mutation_events=[event],
        )
