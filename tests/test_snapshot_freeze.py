import pytest

from src.codex.snapshot_freeze import FrozenSnapshot, freeze_snapshot, snapshot_hash, snapshot_log, snapshot_replay


def test_freeze_sorts_hypotheses_by_id_before_constructing_tuples() -> None:
    snapshot = freeze_snapshot(
        [
            {"id": "h-2", "score": 0.2, "text": "later"},
            {"id": "h-1", "score": 0.9, "text": "first"},
        ]
    )

    assert [hypothesis.id for hypothesis in snapshot.hypotheses] == ["h-1", "h-2"]


def test_freeze_rejects_duplicate_ids_before_creating_frozen_snapshot() -> None:
    with pytest.raises(ValueError, match="must be unique"):
        FrozenSnapshot.freeze(
            [
                {"id": "h-1", "score": 0.3},
                {"id": "h-1", "score": 0.7},
            ]
        )


def test_unordered_inputs_produce_identical_frozen_snapshot_hash_log_and_replay() -> None:
    hypotheses_a = [
        {"id": "h-3", "score": 0.3, "text": "gamma"},
        {"id": "h-1", "score": 0.1, "text": "alpha"},
        {"id": "h-2", "score": 0.2, "text": "beta"},
    ]
    hypotheses_b = [
        {"id": "h-2", "score": 0.2, "text": "beta"},
        {"id": "h-3", "score": 0.3, "text": "gamma"},
        {"id": "h-1", "score": 0.1, "text": "alpha"},
    ]

    frozen_a = freeze_snapshot(hypotheses_a)
    frozen_b = freeze_snapshot(hypotheses_b)

    assert frozen_a == frozen_b
    assert snapshot_hash(hypotheses_a) == snapshot_hash(hypotheses_b)
    assert snapshot_log(hypotheses_a) == snapshot_log(hypotheses_b)
    assert snapshot_replay(hypotheses_a) == snapshot_replay(hypotheses_b)
