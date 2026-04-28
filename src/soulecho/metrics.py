from __future__ import annotations

import math
from statistics import mean
from typing import Iterable, Protocol


class HasLogBelief(Protocol):
    log_belief: float

logger = logging.getLogger(__name__)


def global_coherence(layer_scores: Iterable[float]) -> float:
    scores = list(layer_scores)
    if not scores:
        return 0.0
    return round(mean(scores), 2)


def anomaly_alerts(layer_scores: dict[str, float], threshold: float = 80.0) -> list[str]:
    return [f"{layer} deviated to {score}%" for layer, score in layer_scores.items() if score < threshold]


def derive_belief(log_belief: float, context: Iterable[HasLogBelief]) -> float:
    """Convert a hypothesis log belief into a normalized belief weight.

    Uses a numerically stable softmax formulation by subtracting the maximum
    context log belief before exponentiation.
    """

    hypotheses = list(context)
    if not hypotheses:
        raise ValueError("context must contain at least one hypothesis")

    max_log = max(h.log_belief for h in hypotheses)
    z = sum(math.exp(h.log_belief - max_log) for h in hypotheses)
    return math.exp(log_belief - max_log) / z
