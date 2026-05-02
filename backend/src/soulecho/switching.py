from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

Mode = Literal["particle", "parametric"]



def _unit_interval(value: float) -> float:
    """Clamp numeric values to the explicit [0, 1] range."""
    return max(0.0, min(1.0, float(value)))


@dataclass(frozen=True)
class SwitchPolicy:
    """Policy knobs for model-switch decisions."""

    lambda_weight: float = 0.5
    epsilon_switch: float = 0.5

    def __post_init__(self) -> None:
        if not 0.0 <= self.lambda_weight <= 1.0:
            raise ValueError("lambda_weight (λ) must be within [0, 1]")
        if not 0.0 <= self.epsilon_switch <= 1.0:
            raise ValueError("epsilon_switch (ε_switch) must be within [0, 1]")


@dataclass(frozen=True)
class SwitchDiagnostics:
    from_mode: Mode
    to_mode: Mode
    should_switch: bool
    combined_score: float
    epsilon_switch: float
    components: dict[str, float]


def evaluate_switch(
    *,
    current_mode: Mode,
    js: float,
    support_penalty: float,
    policy: SwitchPolicy,
) -> SwitchDiagnostics:
    """Evaluate whether to switch between particle and parametric modes.

    Both `js` and `support_penalty` are normalized into [0, 1] before scoring.
    Combined score is policy-weighted: λ·JS + (1-λ)·SupportPenalty.
    """
    normalized_js = _unit_interval(js)
    normalized_support_penalty = _unit_interval(support_penalty)
    combined_score = (
        policy.lambda_weight * normalized_js
        + (1.0 - policy.lambda_weight) * normalized_support_penalty
    )

    should_switch = combined_score >= policy.epsilon_switch
    to_mode: Mode
    if should_switch:
        to_mode = "parametric" if current_mode == "particle" else "particle"
    else:
        to_mode = current_mode

    return SwitchDiagnostics(
        from_mode=current_mode,
        to_mode=to_mode,
        should_switch=should_switch,
        combined_score=combined_score,
        epsilon_switch=policy.epsilon_switch,
        components={
            "js": normalized_js,
            "support_penalty": normalized_support_penalty,
            "lambda_weight": policy.lambda_weight,
            "weighted_js": policy.lambda_weight * normalized_js,
            "weighted_support_penalty": (1.0 - policy.lambda_weight)
            * normalized_support_penalty,
        },
    )
