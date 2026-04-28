from src.soulecho.mode_detection import (
    INSUFFICIENT_EVIDENCE_MODE,
    UNDETERMINED_MODE,
    DetectorSignal,
    NoiseAwareModeResolver,
)


def test_returns_insufficient_evidence_when_no_detector_passes_thresholds() -> None:
    resolver = NoiseAwareModeResolver(
        detector_min_data_points={"trend": 5, "spectral": 4},
        detector_min_confidence={"trend": 0.7, "spectral": 0.6},
    )

    decision = resolver.evaluate(
        [
            DetectorSignal("trend", "stable", confidence=0.69, data_points=5),
            DetectorSignal("spectral", "stable", confidence=0.9, data_points=3),
        ]
    )

    assert decision.mode == INSUFFICIENT_EVIDENCE_MODE
    assert decision.committed is False
    assert resolver.committed_mode == UNDETERMINED_MODE


def test_requires_sustained_agreement_before_committing_mode() -> None:
    resolver = NoiseAwareModeResolver(
        detector_min_data_points={"trend": 3, "spectral": 3},
        detector_min_confidence={"trend": 0.6, "spectral": 0.6},
        required_agreement_windows=2,
        min_agreeing_detectors=2,
    )

    first = resolver.evaluate(
        [
            DetectorSignal("trend", "stable", confidence=0.75, data_points=3),
            DetectorSignal("spectral", "stable", confidence=0.77, data_points=3),
        ]
    )
    second = resolver.evaluate(
        [
            DetectorSignal("trend", "stable", confidence=0.74, data_points=3),
            DetectorSignal("spectral", "stable", confidence=0.79, data_points=3),
        ]
    )

    assert first.mode == UNDETERMINED_MODE
    assert first.committed is False
    assert second.mode == "stable"
    assert second.committed is True
    assert resolver.committed_mode == "stable"


def test_audit_log_records_detector_metrics_and_confidence() -> None:
    resolver = NoiseAwareModeResolver(detector_min_data_points={"trend": 2})
    resolver.evaluate(
        [
            DetectorSignal(
                "trend",
                "volatile",
                confidence=0.8,
                data_points=2,
                metrics={"variance": 0.42, "mean_delta": 0.11},
            )
        ]
    )

    record = resolver.audit_log[0]
    assert record.window_id == 1
    assert record.detector_signals[0]["confidence"] == 0.8
    assert record.detector_signals[0]["metrics"] == {"variance": 0.42, "mean_delta": 0.11}
