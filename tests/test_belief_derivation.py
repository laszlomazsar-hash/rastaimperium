from __future__ import annotations

import math
from dataclasses import dataclass

from src.soulecho.metrics import derive_belief


@dataclass
class Hypothesis:
    log_belief: float


def test_derive_belief_is_stable_and_normalized() -> None:
    context = [
        Hypothesis(log_belief=1000.0),
        Hypothesis(log_belief=999.5),
        Hypothesis(log_belief=998.5),
        Hypothesis(log_belief=997.0),
    ]

    beliefs = [derive_belief(h.log_belief, context) for h in context]

    assert all(math.isfinite(value) for value in beliefs)
    assert all(value >= 0.0 for value in beliefs)
    assert math.isclose(sum(beliefs), 1.0, rel_tol=1e-12, abs_tol=1e-12)


def test_derive_belief_raises_for_empty_context() -> None:
    try:
        derive_belief(0.0, [])
    except ValueError as exc:
        assert "context" in str(exc)
    else:
        raise AssertionError("derive_belief should reject empty contexts")
