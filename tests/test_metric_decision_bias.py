from src.ark_safety.metric_decision import (
    MetricPolicy,
    compute_L_from_snapshots,
    decide_state_acceptance,
)


def _policy() -> MetricPolicy:
    return MetricPolicy(
        weights={"coherence": 0.7, "stability": 0.3},
        normalization_bounds={"coherence": (0.0, 10.0), "stability": (0.0, 5.0)},
        schema_version="2.1.0",
    )


def test_identical_states_produce_identical_L_regression() -> None:
    policy = _policy()
    state = {"coherence": 7.5, "stability": 2.5}
    observation = {"coherence": 8.0, "stability": 2.0}

    l_old = compute_L_from_snapshots(state, observation, policy)
    l_candidate = compute_L_from_snapshots(state, observation, policy)

    assert l_old == l_candidate


def test_decision_log_includes_metric_schema_version() -> None:
    policy = _policy()
    old_state = {"coherence": 5.0, "stability": 1.0}
    candidate_state = {"coherence": 8.0, "stability": 2.0}
    observation = {"coherence": 7.0, "stability": 2.0}

    decision = decide_state_acceptance(old_state, candidate_state, observation, policy)

    assert decision["metric_schema_version"] == "2.1.0"
    assert decision["candidate_L"] <= decision["old_L"]
    assert decision["accept_candidate"] is True
