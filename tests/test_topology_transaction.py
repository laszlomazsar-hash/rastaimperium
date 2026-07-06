from __future__ import annotations

from dataclasses import dataclass, field
from threading import Lock
from typing import Any

from soulecho.topology import commit_transaction


@dataclass
class FakeRegistry:
    lock: Lock = field(default_factory=Lock)
    hypotheses: list[dict[str, Any]] = field(default_factory=lambda: [{"id": "base"}])
    lineage: list[dict[str, Any]] = field(default_factory=lambda: [{"candidate_ids": ["base"]}])
    transaction_events: list[dict[str, Any]] = field(default_factory=list)


def test_commit_transaction_success_updates_state_and_emits_one_event() -> None:
    registry = FakeRegistry()

    event = commit_transaction(
        registry,
        candidate=[{"id": "h1"}, {"id": "h2"}],
        reservations=[{"id": "h1"}],
    )

    assert event["success"] is True
    assert registry.hypotheses == [{"id": "h1"}, {"id": "h2"}]
    assert registry.lineage[-1]["candidate_ids"] == ["h1", "h2"]
    assert len(registry.transaction_events) == 1
    assert registry.transaction_events[0] == event


def test_commit_transaction_failure_is_all_or_nothing_and_emits_one_event() -> None:
    registry = FakeRegistry()
    original_hypotheses = list(registry.hypotheses)
    original_lineage = list(registry.lineage)

    event = commit_transaction(
        registry,
        candidate=[{"id": "h1"}],
        reservations=[{"id": "missing"}],
    )

    assert event["success"] is False
    assert "not in candidate" in event["reason"]
    assert registry.hypotheses == original_hypotheses
    assert registry.lineage == original_lineage
    assert len(registry.transaction_events) == 1
    assert registry.transaction_events[0] == event


def test_commit_transaction_duplicate_candidate_ids_fails_without_mutation() -> None:
    registry = FakeRegistry()

    event = commit_transaction(
        registry,
        candidate=[{"id": "dup"}, {"id": "dup"}],
        reservations=[],
    )

    assert event["success"] is False
    assert "unique" in event["reason"]
    assert registry.hypotheses == [{"id": "base"}]
    assert registry.lineage == [{"candidate_ids": ["base"]}]
