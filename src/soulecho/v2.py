from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from math import sin
from typing import Dict, List

from .metrics import EnergyComponentBreakdown, compute_energy_breakdown


@dataclass
class LayerMetric:
    layer: int
    coherence: float


@dataclass
class SoulEchoSnapshot:
    timestamp: str
    livity_score: float
    vibration_score: float
    energy_schema_version: str
    energy_components: dict[str, float | str]
    layer_metrics: List[LayerMetric] = field(default_factory=list)
    mutation_events: List[str] = field(default_factory=list)


class SoulEchoStreamEngine:
    """Generates deterministic snapshot payloads for UI websocket streams."""

    def __init__(self) -> None:
        self._base_layer_score: Dict[int, float] = {layer: 95.0 for layer in range(1, 10)}
        self._event_count = 0

    @staticmethod
    def _delta(step: int, layer: int) -> float:
        # Deterministic bounded oscillation, identical across deployments.
        return 1.5 * sin((step * 0.9) + (layer * 1.7))

    def next_snapshot(self) -> SoulEchoSnapshot:
        layer_metrics: List[LayerMetric] = []
        predicted_scores: List[float] = []
        actual_scores: List[float] = []

        step = self._event_count + 1
        for layer, score in self._base_layer_score.items():
            predicted_scores.append(score)
            updated = max(0.0, min(100.0, score + self._delta(step=step, layer=layer)))
            self._base_layer_score[layer] = updated
            actual_scores.append(updated)
            layer_metrics.append(LayerMetric(layer=layer, coherence=round(updated, 2)))

        self._event_count = step
        livity = round(sum(actual_scores) / len(actual_scores), 2)

        energy: EnergyComponentBreakdown = compute_energy_breakdown(
            actual_scores=actual_scores,
            predicted_scores=predicted_scores,
        )

        vibration = round(max(0.0, min(100.0, livity * energy.energy_score)), 2)
        event = f"EVO-V mutation event #{self._event_count}"

        return SoulEchoSnapshot(
            timestamp=datetime.now(timezone.utc).isoformat(),
            livity_score=livity,
            vibration_score=vibration,
            energy_schema_version=energy.schema_version,
            energy_components={
                "drift_avg": energy.drift_avg,
                "variance_avg": energy.variance_avg,
                "drift_weight": energy.drift_weight,
                "variance_weight": energy.variance_weight,
                "weighted_penalty": energy.weighted_penalty,
                "energy_score": energy.energy_score,
            },
            layer_metrics=layer_metrics,
            mutation_events=[event],
        )
