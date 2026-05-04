from src.soulecho.metrics import (
    ENERGY_SCHEMA_VERSION,
    anomaly_alerts,
    compute_energy_breakdown,
    global_coherence,
    normalized_drift_i,
    normalized_variance_i,
)
from src.soulecho.v2 import SoulEchoStreamEngine


def test_global_coherence_average() -> None:
    assert global_coherence([95, 85, 100]) == 93.33


def test_anomaly_alerts_below_threshold() -> None:
    alerts = anomaly_alerts({"L1": 90, "L2": 79})
    assert alerts == ["L2 deviated to 79%"]


def test_energy_formula_components_and_ranges() -> None:
    breakdown = compute_energy_breakdown(actual_scores=[90.0, 95.0], predicted_scores=[88.0, 96.0])

    assert breakdown.schema_version == ENERGY_SCHEMA_VERSION
    assert 0.0 <= normalized_drift_i(90.0, 88.0) <= 1.0
    assert 0.0 <= normalized_variance_i(90.0, 92.5) <= 1.0
    assert 0.0 <= breakdown.drift_avg <= 1.0
    assert 0.0 <= breakdown.variance_avg <= 1.0
    assert 0.0 <= breakdown.energy_score <= 1.0


def test_soulecho_stream_is_deterministic_across_deployments() -> None:
    first = SoulEchoStreamEngine().next_snapshot()
    second = SoulEchoStreamEngine().next_snapshot()

    assert [metric.coherence for metric in first.layer_metrics] == [
        metric.coherence for metric in second.layer_metrics
    ]
    assert first.energy_schema_version == ENERGY_SCHEMA_VERSION
    assert first.energy_components == second.energy_components
