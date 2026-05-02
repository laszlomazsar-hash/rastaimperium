import math

from app.ark_engine.core.convergence import RollingWindowConvergenceDetector
from app.ark_engine.evo_v_nextgen import BioInspiredCulturalOptimizer


def test_detects_fixed_point_mode() -> None:
    detector = RollingWindowConvergenceDetector(window_size=16)
    trajectory = [(1 / (idx + 1), 1 / (idx + 1)) for idx in range(32)]

    result = detector.detect(trajectory)

    assert result["current_mode"] == "fixed_point"
    assert result["confidence"] >= 0.55
    assert result["supporting_metrics"]["state_distance_decay"] > 0.35


def test_detects_periodic_mode() -> None:
    detector = RollingWindowConvergenceDetector(window_size=12)
    trajectory = [(0.0, 1.0), (1.0, 0.0)] * 20

    result = detector.detect(trajectory)

    assert result["current_mode"] == "periodic"
    assert result["supporting_metrics"]["periodicity_score"] >= 0.7


def test_detects_bounded_aperiodic_mode() -> None:
    detector = RollingWindowConvergenceDetector(window_size=20)
    trajectory = [
        (math.sin(idx * 0.7), math.sin(idx * 1.1), math.cos(idx * 1.7))
        for idx in range(60)
    ]

    result = detector.detect(trajectory)

    assert result["current_mode"] == "bounded_aperiodic"
    assert result["supporting_metrics"]["bounded_aperiodicity_indicator"] >= 0.55


def test_optimizer_emits_mode_telemetry() -> None:
    optimizer = BioInspiredCulturalOptimizer()
    landscape = {"swarm_trajectory": [(0.0, 1.0), (1.0, 0.0)] * 12}

    result = optimizer.swarm_cultural_optimization(landscape)

    telemetry = result["telemetry"]
    assert telemetry["current_mode"] == "periodic"
    assert "supporting_metrics" in telemetry
    assert set(telemetry["supporting_metrics"]) >= {
        "state_distance_decay",
        "periodicity_score",
        "bounded_aperiodicity_indicator",
    }
