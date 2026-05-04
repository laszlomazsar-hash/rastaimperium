from src.soulecho.metrics import (
    action_conflict_metric,
    contradiction_control_signal,
    mode_count_proxy,
    normalize_component,
    spread_metric,
    weighted_contradiction_score,
)


def test_component_functions_capture_modes_spread_and_conflicts() -> None:
    assert mode_count_proxy([0.0, 0.02, 0.10, -0.20], activity_threshold=0.05) == 2
    assert spread_metric([0.15, 0.45, 0.05]) == 0.4
    assert action_conflict_metric([1.0, -1.0, 2.0]) == 2 / 3


def test_normalization_and_weighted_aggregation_are_bounded() -> None:
    mode = normalize_component(3, 0, 8)
    spread = normalize_component(0.4, 0, 1)
    conflict = normalize_component(0.6, 0, 1)

    score = weighted_contradiction_score(mode, spread, conflict)
    assert 0.0 <= mode <= 1.0
    assert 0.0 <= spread <= 1.0
    assert 0.0 <= conflict <= 1.0
    assert 0.0 <= score <= 1.0


def test_control_signal_respects_explicit_policy_thresholds() -> None:
    observe = contradiction_control_signal(
        mode_values=[0.01, 0.02],
        geometry_values=[0.1, 0.11],
        action_values=[0.2, 0.25],
        soft_threshold=0.35,
        hard_threshold=0.7,
    )
    assert observe.policy_state == "observe"
    assert observe.signal == 0.0
    assert observe.trigger_soft is False
    assert observe.trigger_hard is False

    stabilize = contradiction_control_signal(
        mode_values=[0.1, 0.2, -0.3],
        geometry_values=[0.1, 0.7],
        action_values=[1, -1, 1],
        soft_threshold=0.35,
        hard_threshold=0.7,
    )
    assert stabilize.policy_state == "stabilize"
    assert 0.0 < stabilize.signal < 1.0
    assert stabilize.trigger_soft is True
    assert stabilize.trigger_hard is False

    intervene = contradiction_control_signal(
        mode_values=[0.1, 0.2, -0.3, 0.5, -0.4, 0.9, -1.0],
        geometry_values=[0.0, 1.0],
        action_values=[1, -1, 1, -1],
        soft_threshold=0.35,
        hard_threshold=0.7,
    )
    assert intervene.policy_state == "intervene"
    assert intervene.signal == 1.0
    assert intervene.trigger_soft is True
    assert intervene.trigger_hard is True
