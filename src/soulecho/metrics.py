from __future__ import annotations

from dataclasses import dataclass
from itertools import combinations
from statistics import mean
from typing import Iterable


def global_coherence(layer_scores: Iterable[float]) -> float:
    scores = list(layer_scores)
    if not scores:
        return 0.0
    return round(mean(scores), 2)


def anomaly_alerts(layer_scores: dict[str, float], threshold: float = 80.0) -> list[str]:
    return [f"{layer} deviated to {score}%" for layer, score in layer_scores.items() if score < threshold]


def mode_count_proxy(modes: Iterable[float], activity_threshold: float = 0.05) -> int:
    """Approximate active contradiction modes by counting non-trivial magnitudes."""
    return sum(1 for value in modes if abs(value) >= activity_threshold)


def spread_metric(values: Iterable[float]) -> float:
    """Measure geometric spread as range (max - min)."""
    points = list(values)
    if not points:
        return 0.0
    return max(points) - min(points)


def action_conflict_metric(actions: Iterable[float], neutral_threshold: float = 1e-9) -> float:
    """
    Estimate directional conflict as the fraction of pairwise sign disagreements.

    Actions near zero are treated as neutral and excluded from conflict counting.
    """
    active_actions = [action for action in actions if abs(action) > neutral_threshold]
    if len(active_actions) < 2:
        return 0.0

    total_pairs = 0
    conflict_pairs = 0
    for left, right in combinations(active_actions, 2):
        total_pairs += 1
        if left * right < 0:
            conflict_pairs += 1
    return conflict_pairs / total_pairs if total_pairs else 0.0


def normalize_component(value: float, floor: float, ceiling: float) -> float:
    """Min-max normalization to [0, 1] with clamping."""
    if ceiling <= floor:
        raise ValueError("ceiling must be greater than floor")
    scaled = (value - floor) / (ceiling - floor)
    return max(0.0, min(1.0, scaled))


def weighted_contradiction_score(
    mode_component: float,
    spread_component: float,
    conflict_component: float,
    *,
    mode_weight: float = 0.3,
    spread_weight: float = 0.3,
    conflict_weight: float = 0.4,
) -> float:
    """Weighted aggregate normalized to [0, 1]."""
    if min(mode_weight, spread_weight, conflict_weight) < 0:
        raise ValueError("weights must be non-negative")
    weight_sum = mode_weight + spread_weight + conflict_weight
    if weight_sum == 0:
        raise ValueError("at least one weight must be positive")
    weighted = (
        mode_component * mode_weight
        + spread_component * spread_weight
        + conflict_component * conflict_weight
    ) / weight_sum
    return max(0.0, min(1.0, weighted))


@dataclass(frozen=True)
class ContradictionControlDecision:
    score: float
    signal: float
    policy_state: str
    trigger_soft: bool
    trigger_hard: bool


def contradiction_control_signal(
    *,
    mode_values: Iterable[float],
    geometry_values: Iterable[float],
    action_values: Iterable[float],
    mode_range: tuple[float, float] = (0.0, 8.0),
    spread_range: tuple[float, float] = (0.0, 1.0),
    conflict_range: tuple[float, float] = (0.0, 1.0),
    soft_threshold: float = 0.35,
    hard_threshold: float = 0.70,
) -> ContradictionControlDecision:
    """
    Turn geometric contradiction into an actionable control signal.

    The output signal is bounded to [0, 1] and tied to explicit policy thresholds:
    - score < soft_threshold: observe
    - soft_threshold <= score < hard_threshold: stabilize (soft trigger)
    - score >= hard_threshold: intervene (hard trigger)
    """
    mode_component = normalize_component(
        mode_count_proxy(mode_values), mode_range[0], mode_range[1]
    )
    spread_component = normalize_component(
        spread_metric(geometry_values), spread_range[0], spread_range[1]
    )
    conflict_component = normalize_component(
        action_conflict_metric(action_values), conflict_range[0], conflict_range[1]
    )

    score = weighted_contradiction_score(mode_component, spread_component, conflict_component)

    if hard_threshold <= soft_threshold:
        raise ValueError("hard_threshold must be greater than soft_threshold")
    if score < soft_threshold:
        return ContradictionControlDecision(
            score=score,
            signal=0.0,
            policy_state="observe",
            trigger_soft=False,
            trigger_hard=False,
        )

    if score >= hard_threshold:
        return ContradictionControlDecision(
            score=score,
            signal=1.0,
            policy_state="intervene",
            trigger_soft=True,
            trigger_hard=True,
        )

    signal = normalize_component(score, soft_threshold, hard_threshold)
    return ContradictionControlDecision(
        score=score,
        signal=signal,
        policy_state="stabilize",
        trigger_soft=True,
        trigger_hard=False,
    )
