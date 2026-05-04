from __future__ import annotations

from codex.hypothesis_registry import Hypothesis, HypothesisRegistry


def test_freeze_returns_immutable_value_snapshots() -> None:
    registry = HypothesisRegistry()
    hypothesis = Hypothesis(name="a", value={"score": 1, "tags": ["seed"]})
    registry.add(hypothesis)

    frozen = registry.freeze()

    hypothesis.value["score"] = 2
    hypothesis.value["tags"].append("mutated")

    assert frozen.hypotheses[0].value == {"score": 1, "tags": ["seed"]}


def test_freeze_isolation_survives_registry_container_mutations() -> None:
    registry = HypothesisRegistry()
    first = Hypothesis(name="first", value={"n": 1})
    second = Hypothesis(name="second", value={"n": 2})
    registry.add(first)
    registry.add(second)

    frozen = registry.freeze()

    first.value["n"] = 10
    second.value["n"] = 20
    registry.add(Hypothesis(name="third", value={"n": 3}))

    frozen_values = tuple(snapshot.value["n"] for snapshot in frozen.hypotheses)
    assert frozen_values == (1, 2)
