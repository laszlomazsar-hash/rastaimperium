from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, Mapping, MutableMapping


@dataclass(frozen=True)
class MetricPolicy:
    """Versioned metric policy used for state acceptance decisions."""

    weights: Mapping[str, float]
    normalization_bounds: Mapping[str, tuple[float, float]] = field(default_factory=dict)
    schema_version: str = "1.0.0"


def _normalize_value(value: float, lower: float, upper: float) -> float:
    if upper <= lower:
        return 0.0
    scaled = (value - lower) / (upper - lower)
    return max(0.0, min(1.0, scaled))


def _normalize_snapshot(snapshot: Mapping[str, float], policy: MetricPolicy) -> Dict[str, float]:
    normalized: Dict[str, float] = {}
    for metric in policy.weights:
        raw_value = float(snapshot.get(metric, 0.0))
        lower, upper = policy.normalization_bounds.get(metric, (0.0, 1.0))
        normalized[metric] = _normalize_value(raw_value, lower, upper)
    return normalized


def _compute_weighted_distance(
    normalized_state: Mapping[str, float],
    normalized_observation: Mapping[str, float],
    policy: MetricPolicy,
) -> float:
    total = 0.0
    for metric, weight in policy.weights.items():
        delta = normalized_state.get(metric, 0.0) - normalized_observation.get(metric, 0.0)
        total += float(weight) * (delta * delta)
    return total


def compute_L_from_snapshots(
    state_snapshot: Mapping[str, float],
    observation_snapshot: Mapping[str, float],
    policy: MetricPolicy,
) -> float:
    """Compute one shared objective L from normalized and weighted snapshots."""

    normalized_state = _normalize_snapshot(state_snapshot, policy)
    normalized_observation = _normalize_snapshot(observation_snapshot, policy)
    return _compute_weighted_distance(normalized_state, normalized_observation, policy)


def decide_state_acceptance(
    old_state_snapshot: Mapping[str, float],
    candidate_state_snapshot: Mapping[str, float],
    observation_snapshot: Mapping[str, float],
    policy: MetricPolicy,
) -> MutableMapping[str, float | str | bool]:
    """Evaluate old and candidate states with the exact same metric pipeline."""

    old_L = compute_L_from_snapshots(old_state_snapshot, observation_snapshot, policy)
    candidate_L = compute_L_from_snapshots(candidate_state_snapshot, observation_snapshot, policy)
    accept_candidate = candidate_L <= old_L

    return {
        "accept_candidate": accept_candidate,
        "selected_state": "candidate" if accept_candidate else "old",
        "old_L": old_L,
        "candidate_L": candidate_L,
        "metric_schema_version": policy.schema_version,
    }
