from src.codex.hypothesis_freeze import CANONICAL_RAW_FIELDS, freeze_state


def test_frozen_snapshot_schema_contains_only_canonical_raw_fields() -> None:
    state = {
        "hypotheses": [
            {
                "id": "h-001",
                "raw": "Users struggle with onboarding",
                "source": "interview",
                "timestamp": "2026-04-27T00:00:00Z",
                "belief": 0.93,
                "score": 99,
            }
        ]
    }

    frozen = freeze_state(state)

    assert list(frozen.keys()) == ["hypotheses"]
    assert len(frozen["hypotheses"]) == 1
    assert set(frozen["hypotheses"][0].keys()) == set(CANONICAL_RAW_FIELDS)
    assert "belief" not in frozen["hypotheses"][0]
