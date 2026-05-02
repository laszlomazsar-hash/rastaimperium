from __future__ import annotations

from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "evo-v" / "app"))

from agents.reasoning_agent import Hypothesis, ReasoningAgent


def test_prune_hypotheses_empty_input_uses_bootstrap_fallback() -> None:
    agent = ReasoningAgent(name="tester")

    result = agent.prune_hypotheses([], min_count=2)

    assert len(result) == 2
    assert [item.label for item in result] == ["bootstrap_hypothesis_1", "bootstrap_hypothesis_2"]
    assert agent.events[-1]["event"] == "prune_empty_fallback_applied"


def test_prune_hypotheses_single_valid_input_preserves_min_count() -> None:
    agent = ReasoningAgent(name="tester")

    result = agent.prune_hypotheses([Hypothesis(label="signal_a", confidence=0.7)], min_count=2)

    assert len(result) == 2
    assert result[0].label == "signal_a"
    assert result[1].label == "bootstrap_hypothesis_1"


def test_prune_hypotheses_degraded_recovery_holds_last_valid() -> None:
    agent = ReasoningAgent(name="tester")

    valid = [
        Hypothesis(label="signal_a", confidence=0.9),
        Hypothesis(label="signal_b", confidence=0.8),
    ]
    agent.prune_hypotheses(valid, min_count=2)

    recovered = agent.prune_hypotheses([Hypothesis(label="bad", confidence=0.0)], min_count=2)

    assert [item.label for item in recovered] == ["signal_a", "signal_b"]
    assert agent.events[-1]["event"] == "prune_empty_fallback_applied"
