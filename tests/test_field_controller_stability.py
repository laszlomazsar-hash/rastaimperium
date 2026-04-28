from app.ark_engine.core.field_controller import IFieldController


def test_min_dwell_blocks_fast_oscillation() -> None:
    controller = IFieldController()

    controller.update_state("deep joy in zion", 0.95)
    assert controller.current_state == "ROOTS_GROUNDING"
    assert "dwell_guard_active" in controller.current_action_state["reason"]

    controller.update_state("deep joy in zion", 0.95)
    assert controller.current_state == "ZION_FLOW"


def test_hysteresis_holds_state_near_threshold() -> None:
    controller = IFieldController()

    controller.update_state("deep joy in zion", 0.95)
    controller.update_state("deep joy in zion", 0.95)
    assert controller.current_state == "ZION_FLOW"

    controller.update_state("quiet focus", 0.8)
    assert controller.current_state == "ZION_FLOW"

    controller.update_state("quiet focus", 0.7)
    assert controller.current_state == "ROOTS_GROUNDING"


def test_transition_log_persists_reason_and_boundary_metrics() -> None:
    controller = IFieldController()

    controller.update_state("network drive", 0.2)
    controller.update_state("network drive", 0.2)

    replay = controller.get_transition_replay()
    assert len(replay) == 1
    transition = replay[0]

    assert transition["from"] == "ROOTS_GROUNDING"
    assert transition["to"] == "BABYLON_BURN"
    assert transition["reason"] == "score_below_babylon_enter_threshold"
    assert transition["boundary_metrics"]["score"] == 0.2
    assert "thresholds" in transition["boundary_metrics"]
