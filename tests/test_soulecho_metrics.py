from src.soulecho.metrics import (
    METRIC_SCHEMA_VERSION,
    anomaly_alerts,
    drift_i,
    energy_from_runtime_snapshot,
    global_coherence,
)
from src.soulecho.v2 import LayerMetric, SoulEchoStreamEngine


def test_global_coherence_average() -> None:
    assert global_coherence([95, 85, 100]) == 93.33


def test_anomaly_alerts_below_threshold() -> None:
    alerts = anomaly_alerts({"L1": 90, "L2": 79})
    assert alerts == ["L2 deviated to 79%"]


def test_drift_i_uses_canonical_fields() -> None:
    hypothesis = LayerMetric(layer=1, coherence=96.0, predictive_mean=0.25)
    assert drift_i(snapshot_drift=0.1, hypothesis=hypothesis) == 0.15


def test_energy_computation_accepts_runtime_objects() -> None:
    hypotheses = [
        LayerMetric(layer=1, coherence=97.0, predictive_mean=0.2),
        LayerMetric(layer=2, coherence=95.0, predictive_mean=0.4),
    ]
    energy = energy_from_runtime_snapshot(snapshot_drift=0.1, hypotheses=hypotheses)
    assert energy == 0.8333


def test_stream_snapshot_versions_metric_schema_and_energy() -> None:
    snapshot = SoulEchoStreamEngine().next_snapshot()
    assert snapshot.metric_schema_version == METRIC_SCHEMA_VERSION
    assert 0 <= snapshot.energy_score <= 1
    assert all(hasattr(metric, "predictive_mean") for metric in snapshot.layer_metrics)
