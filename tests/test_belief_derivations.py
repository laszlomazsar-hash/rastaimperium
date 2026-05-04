from math import isclose

from src.soulecho.metrics import (
    BeliefSnapshot,
    compute_energy,
    compute_entropy,
    normalize_log_beliefs,
)


def _snapshots(log_beliefs: list[float]) -> list[BeliefSnapshot]:
    return [
        BeliefSnapshot(
            id=f"hypothesis-{index}",
            log_belief=log_belief,
            predictive_mean=1.0 + index,
            variance=0.1 * (index + 1),
        )
        for index, log_belief in enumerate(log_beliefs)
    ]


def test_normalize_log_beliefs_is_stable_and_sums_to_one() -> None:
    weights = normalize_log_beliefs([-1200.0, -1199.0, -1198.0])

    assert isclose(sum(weights), 1.0, rel_tol=0.0, abs_tol=1e-12)
    assert all(weight > 0.0 for weight in weights)


def test_same_log_beliefs_produce_same_derived_weights() -> None:
    one = _snapshots([-2.0, -0.5, -1.25])
    two = _snapshots([-2.0, -0.5, -1.25])

    assert normalize_log_beliefs([snapshot.log_belief for snapshot in one]) == normalize_log_beliefs(
        [snapshot.log_belief for snapshot in two]
    )


def test_energy_and_entropy_depend_on_canonical_log_beliefs_only() -> None:
    baseline = _snapshots([-2.0, -0.5, -1.25])
    shifted = [
        BeliefSnapshot(
            id=snapshot.id,
            log_belief=snapshot.log_belief,
            predictive_mean=snapshot.predictive_mean + 5.0,
            variance=snapshot.variance + 1.0,
        )
        for snapshot in baseline
    ]

    baseline_weights = normalize_log_beliefs([snapshot.log_belief for snapshot in baseline])
    shifted_weights = normalize_log_beliefs([snapshot.log_belief for snapshot in shifted])

    assert baseline_weights == shifted_weights
    assert compute_energy(baseline) != compute_energy(shifted)
    assert compute_entropy(baseline) == compute_entropy(shifted)
