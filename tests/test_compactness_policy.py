from app.ark_engine.core.validator_enhanced import (
    CompactnessPolicyBounds,
    EnhancedSafetyValidator,
)


def test_policy_bounds_are_concrete() -> None:
    bounds = CompactnessPolicyBounds()

    assert bounds.max_hypotheses == 64
    assert bounds.predictive_mean_range == (-1000.0, 1000.0)
    assert bounds.variance_range == (1e-9, 1000.0)
    assert bounds.log_belief_range == (-1000.0, 0.0)


def test_canonical_projection_ignores_non_metric_metadata() -> None:
    validator = EnhancedSafetyValidator()
    state = {
        "id": "abc-123",
        "timestamp": "2026-04-27T00:00:00Z",
        "metrics": {"predictive_mean": 0.4, "variance": 0.5, "log_belief": -0.1},
        "hypotheses": [{"predictive_mean": 0.3, "variance": 0.2, "log_belief": -0.2}],
        "topology": {"id": "topo-id", "edges": 4},
    }

    projected = validator.canonical_projection(state)

    assert "bounded_metadata" not in projected
    assert projected["topology"] == {"edges": 4}


def test_structural_ops_and_commit_gate_enforce_bounds() -> None:
    validator = EnhancedSafetyValidator(bounds=CompactnessPolicyBounds(max_hypotheses=1))
    state = {
        "metrics": {"predictive_mean": 0.0, "variance": 0.2, "log_belief": -0.5},
        "hypotheses": [],
    }

    updated = validator.enforce_structural_operation(
        state,
        {
            "op": "append_hypothesis",
            "payload": {"predictive_mean": 0.1, "variance": 0.2, "log_belief": -0.3},
        },
    )
    assert validator.commit_gate(updated) is True

    try:
        validator.enforce_structural_operation(
            updated,
            {
                "op": "append_hypothesis",
                "payload": {
                    "predictive_mean": 0.2,
                    "variance": 0.3,
                    "log_belief": -0.2,
                },
            },
        )
    except ValueError as exc:
        assert "max_hypotheses" in str(exc)
    else:
        raise AssertionError("Expected max_hypotheses bound violation")


def test_compactness_theorem_statement_scoped_to_enforced_bounds() -> None:
    statement = EnhancedSafetyValidator().compactness_theorem_statement()

    assert "only when commits pass the gate" in statement
    assert "max_hypotheses" in statement
