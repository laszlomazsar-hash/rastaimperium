from app.ark_engine.evo_v_nextgen import EvolutionaryCulturalOptimizer


def test_cultural_simulation_emits_runtime_model_error_signal() -> None:
    optimizer = EvolutionaryCulturalOptimizer(model_error_budget=0.25)
    initial_cultures = [
        {"name": "Roots", "values": ["integrity", "stewardship"], "energy": 0.82},
        {"name": "Zion", "values": ["vision"], "energy": 0.91},
    ]

    result = optimizer.cultural_evolution_simulation(initial_cultures=initial_cultures, steps=3)
    assert result["model_error_budget"] == 0.25
    assert len(result["error_audit_log"]) == 3

    first_tick = result["evolution_history"][0]
    assert "epsilon_model" in first_tick
    assert "epsilon_confidence_interval" in first_tick
    assert "control_policy" in first_tick
    assert "lyapunov_residual_decomposition" in first_tick
    assert "integration_error_term" in first_tick["lyapunov_residual_decomposition"]
    assert "projection_distortion_term" in first_tick["lyapunov_residual_decomposition"]
    assert "representation_error_term" in first_tick["lyapunov_residual_decomposition"]


def test_aggressiveness_gate_applies_when_error_budget_exceeded() -> None:
    optimizer = EvolutionaryCulturalOptimizer(model_error_budget=0.01)
    initial_cultures = [{"name": "HighVarianceCultureName", "values": ["one", "two", "three"], "energy": 0.95}]

    result = optimizer.cultural_evolution_simulation(initial_cultures=initial_cultures, steps=1)
    policy = result["evolution_history"][0]["control_policy"]
    assert policy["gated"] is True
    assert policy["aggressiveness"] == 0.25
