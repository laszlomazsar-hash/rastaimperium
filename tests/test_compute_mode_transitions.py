from codex.compute_mode import (
    DIAGNOSTICS_SCHEMA_VERSION,
    ComputeModeController,
    replay_mode_timeline,
)


def test_tick_emits_versioned_explainable_diagnostics() -> None:
    controller = ComputeModeController(initial_mode="balanced", hysteresis_ticks=2)

    diagnostics = controller.tick({"pressure": 0.9, "budget_remaining": 0.5})

    assert diagnostics.schema_version == DIAGNOSTICS_SCHEMA_VERSION
    assert diagnostics.mode == "balanced"
    assert diagnostics.previous_mode == "balanced"
    assert diagnostics.hysteresis_counter == 1
    assert diagnostics.budget_state_snapshot == {"budget_remaining": 0.5, "pressure": 0.9}
    assert diagnostics.triggers["selected_rule"] == "upgrade_to_turbo_on_pressure"
    assert diagnostics.triggers["fired_rule"] == "upgrade_to_turbo_on_pressure:pending_hysteresis"


def test_tick_marks_suppressed_rules() -> None:
    controller = ComputeModeController(initial_mode="eco", hysteresis_ticks=1)

    diagnostics = controller.tick({"pressure": 0.9, "budget_remaining": 0.1})

    assert diagnostics.mode == "turbo"
    assert diagnostics.triggers["selected_rule"] == "upgrade_to_turbo_on_pressure"
    assert diagnostics.triggers["suppressed_rules"] == ["stabilize_at_balanced"]


def test_replay_reproduces_identical_timeline_and_reasons() -> None:
    history = [
        {"pressure": 0.15, "budget_remaining": 0.9},
        {"pressure": 0.20, "budget_remaining": 0.8},
        {"pressure": 0.85, "budget_remaining": 0.7},
        {"pressure": 0.86, "budget_remaining": 0.6},
        {"pressure": 0.50, "budget_remaining": 0.5},
    ]

    first_run = replay_mode_timeline(history, initial_mode="balanced", hysteresis_ticks=2)
    second_run = replay_mode_timeline(history, initial_mode="balanced", hysteresis_ticks=2)

    assert [diag.mode for diag in first_run] == [diag.mode for diag in second_run]
    assert [diag.previous_mode for diag in first_run] == [diag.previous_mode for diag in second_run]
    assert [diag.triggers for diag in first_run] == [diag.triggers for diag in second_run]
