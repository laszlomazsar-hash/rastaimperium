from app.ark_engine.core.lyapunov_beliefs import (
    FrozenBeliefSnapshot,
    FrozenHypothesis,
    LyapunovBeliefPipeline,
)


def test_derive_belief_vector_uses_frozen_log_beliefs() -> None:
    snapshot = FrozenBeliefSnapshot(
        hypotheses=[
            FrozenHypothesis(hypothesis_id="h2", log_belief=-1.0),
            FrozenHypothesis(hypothesis_id="h1", log_belief=0.0),
        ]
    )

    beliefs = LyapunovBeliefPipeline.derive_belief_vector(snapshot)

    assert len(beliefs) == 2
    assert abs(sum(beliefs) - 1.0) < 1e-12
    assert beliefs[0] > beliefs[1]


def test_deterministic_replay_same_snapshot_same_belief_vector() -> None:
    snapshot = FrozenBeliefSnapshot(
        hypotheses=[
            FrozenHypothesis(hypothesis_id="h2", log_belief=-0.2),
            FrozenHypothesis(hypothesis_id="h1", log_belief=-0.4),
            FrozenHypothesis(hypothesis_id="h3", log_belief=-3.0),
        ]
    )

    first = LyapunovBeliefPipeline.derive_belief_vector(snapshot)
    second = LyapunovBeliefPipeline.derive_belief_vector(snapshot)

    assert first == second
