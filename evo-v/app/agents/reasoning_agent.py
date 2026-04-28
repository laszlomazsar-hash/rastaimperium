from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List

from .agent_base import AgentBase


@dataclass(frozen=True)
class Hypothesis:
    """Represents one inference hypothesis candidate."""

    label: str
    confidence: float

    def as_dict(self) -> Dict[str, Any]:
        return {"label": self.label, "confidence": self.confidence}


class ReasoningAgent(AgentBase):
    def __init__(self, name: str) -> None:
        super().__init__(name=name)
        self.status = "ready"
        self._last_valid_hypotheses: List[Hypothesis] = []
        self.events: List[Dict[str, Any]] = []

    def evaluate(self, payload: str) -> str:
        self.set_status("evaluating")
        response = f"Agent {self.name} processed: {payload}"
        self.set_status("ready")
        return response

    def prune_hypotheses(self, hypotheses: List[Hypothesis], min_count: int = 1) -> List[Hypothesis]:
        """Prune invalid hypotheses while keeping inference state deterministic and valid."""

        if min_count < 1:
            raise ValueError("min_count must be >= 1")

        pruned = [hypothesis for hypothesis in hypotheses if hypothesis.confidence > 0.0]

        if not pruned:
            fallback = self._deterministic_fallback(min_count=min_count)
            self.events.append(
                {
                    "event": "prune_empty_fallback_applied",
                    "reason": "no_valid_hypotheses_post_prune",
                    "min_count": min_count,
                    "fallback_size": len(fallback),
                }
            )
            self._last_valid_hypotheses = list(fallback)
            return fallback

        if len(pruned) < min_count:
            pruned.extend(self._bootstrap_hypotheses(min_count - len(pruned)))

        self._last_valid_hypotheses = list(pruned)
        return pruned

    def _deterministic_fallback(self, min_count: int) -> List[Hypothesis]:
        if self._last_valid_hypotheses:
            return list(self._last_valid_hypotheses[:min_count])
        return self._bootstrap_hypotheses(min_count)

    def _bootstrap_hypotheses(self, count: int) -> List[Hypothesis]:
        return [Hypothesis(label=f"bootstrap_hypothesis_{i + 1}", confidence=1.0) for i in range(count)]
