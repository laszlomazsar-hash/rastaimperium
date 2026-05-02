from src.codex.measure_runtime_bridge import FormalMeasure, MeasureRuntimeBridge


def test_round_trip_projection_has_bounded_error() -> None:
    bridge = MeasureRuntimeBridge(particle_count=400)
    formal = FormalMeasure(
        support=[(0.0,), (1.0,), (2.0,)],
        mass=[0.2, 0.5, 0.3],
    )

    runtime = bridge.project_formal_to_runtime(formal, seed=42)
    reconstructed = bridge.project_runtime_to_formal(runtime)
    error = bridge.approximation_error(formal, reconstructed)

    assert error < 0.08


def test_update_resamples_when_ess_collapses() -> None:
    bridge = MeasureRuntimeBridge(particle_count=50, ess_resample_ratio=0.8)
    formal = FormalMeasure(
        support=[(0.0,), (1.0,), (2.0,)],
        mass=[0.34, 0.33, 0.33],
    )
    runtime = bridge.project_formal_to_runtime(formal, seed=1)

    def sharp_likelihood(state: tuple[float, ...]) -> float:
        return 1.0 if state[0] == 2.0 else 1e-9

    updated = bridge.update(runtime, sharp_likelihood, seed=7)
    ess_ratio = bridge.effective_sample_size(updated) / len(updated.particles)

    assert ess_ratio >= bridge.bounds.min_effective_sample_ratio
    assert abs(sum(updated.weights) - 1.0) < 1e-9
