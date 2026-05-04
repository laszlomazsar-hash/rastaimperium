from app.core.container import get_container


def test_cultural_simulation_emits_runtime_model_error_signal() -> None:
    optimizer = get_container().evolutionary_optimizer
    optimizer.model_error_budget = 0.25
    initial_cultures = [
        {"name": "Roots", "values": ["integrity", "stewardship"], "energy": 0.82},
        {"name": "Zion", "values": ["vision"], "energy": 0.91},
    ]

    result = optimizer.cultural_evolution_simulation(initial_cultures=initial_cultures, steps=3)
    assert result["model_error_budget"] == 0.25
    assert len(result["error_audit_log"]) == 3

    first_tick = result["evolution_history"][0]
    assert "epsilon_model" in first_tick


def test_aggressiveness_gate_applies_when_error_budget_exceeded() -> None:
    optimizer = get_container().evolutionary_optimizer
    optimizer.model_error_budget = 0.01
    initial_cultures = [{"name": "HighVarianceCultureName", "values": ["one", "two", "three"], "energy": 0.95}]

    result = optimizer.cultural_evolution_simulation(initial_cultures=initial_cultures, steps=1)
    policy = result["evolution_history"][0]["control_policy"]
    assert policy["gated"] is True
