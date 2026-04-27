from __future__ import annotations

from statistics import mean
from typing import Iterable


def global_coherence(layer_scores: Iterable[float]) -> float:
    scores = list(layer_scores)
    if not scores:
        return 0.0
    return round(mean(scores), 2)


def anomaly_alerts(layer_scores: dict[str, float], threshold: float = 80.0) -> list[str]:
    return [f"{layer} deviated to {score}%" for layer, score in layer_scores.items() if score < threshold]


def bounded_drift(raw_drift: float, *, scale: float = 100.0) -> float:
    """Map raw drift onto [0, 1] with explicit hard-bounding."""
    if scale <= 0:
        raise ValueError("scale must be > 0")
    return min(max(raw_drift, 0.0) / scale, 1.0)


def bounded_variance_term(variance: float) -> float:
    """Clamp the variance contribution into [0, 1]."""
    return min(max(variance, 0.0), 1.0)


def normalize_component_weights(*weights: float) -> tuple[float, ...]:
    """
    Normalize non-negative component weights to sum to 1.

    Formal bound used by `bounded_energy_index`:
    Let d, v ∈ [0, 1] and w_d, w_v ≥ 0 with w_d + w_v = 1.
    Then E = w_d·d + w_v·v is a convex combination, therefore:
    0 ≤ E ≤ w_d·1 + w_v·1 = 1.
    """
    if not weights:
        raise ValueError("at least one weight is required")
    if any(w < 0 for w in weights):
        raise ValueError("weights must be non-negative")

    total = sum(weights)
    if total == 0:
        equal = 1.0 / len(weights)
        return tuple(equal for _ in weights)
    return tuple(w / total for w in weights)


def bounded_energy_index(
    raw_drift: float,
    variance: float,
    *,
    drift_scale: float = 100.0,
    drift_weight: float = 0.5,
    variance_weight: float = 0.5,
) -> float:
    """
    Compute bounded E using normalized weights and bounded components.

    Returns E in [0, 1].
    """
    drift_component = bounded_drift(raw_drift, scale=drift_scale)
    variance_component = bounded_variance_term(variance)
    w_drift, w_variance = normalize_component_weights(drift_weight, variance_weight)
    energy = (w_drift * drift_component) + (w_variance * variance_component)
    return min(max(energy, 0.0), 1.0)
