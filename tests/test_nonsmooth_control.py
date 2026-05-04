from app.ark_engine.core.nonsmooth_control import (
    DeterministicSelectionPolicy,
    NonsmoothControlUpdater,
    SubgradientCandidate,
)


def test_boundary_selection_minimum_norm_then_lexicographic_tiebreak() -> None:
    updater = NonsmoothControlUpdater()
    candidates = [
        SubgradientCandidate(descriptor="zeta", vector=(0.3, 0.4)),
        SubgradientCandidate(descriptor="beta", vector=(0.0, 0.5)),
        SubgradientCandidate(descriptor="alpha", vector=(-0.5, 0.0)),
    ]

    selected = updater.select_subgradient(candidates)

    assert selected.vector == (-0.5, 0.0)
    assert selected.descriptor == "alpha"


def test_policy_versions_selection_rule() -> None:
    policy = DeterministicSelectionPolicy(version="1.2.3")

    assert policy.version == "1.2.3"
    assert policy.rule == "minimum_norm_then_lexicographic"


def test_logs_selected_descriptor_each_nonsmooth_tick() -> None:
    updater = NonsmoothControlUpdater()
    candidates = [
        SubgradientCandidate(descriptor="left", vector=(-1.0, 0.0)),
        SubgradientCandidate(descriptor="right", vector=(1.0, 0.0)),
    ]

    updater.update_control("x=0", candidates, nonsmooth_mode=True)
    updater.update_control("x=0", candidates, nonsmooth_mode=True)

    assert len(updater.tick_logs) == 2
    assert all(log.nonsmooth_mode for log in updater.tick_logs)
    assert [log.selected_subgradient_descriptor for log in updater.tick_logs] == ["left", "left"]


def test_replay_identical_boundary_states_are_stable() -> None:
    trajectory = [
        (
            "x=0,y=0",
            [
                SubgradientCandidate(descriptor="A", vector=(1.0, 1.0)),
                SubgradientCandidate(descriptor="B", vector=(-1.0, 1.0)),
            ],
            True,
        ),
        (
            "x=0,y=0",
            [
                SubgradientCandidate(descriptor="A", vector=(1.0, 1.0)),
                SubgradientCandidate(descriptor="B", vector=(-1.0, 1.0)),
            ],
            True,
        ),
    ]

    run_one = NonsmoothControlUpdater()
    run_two = NonsmoothControlUpdater()

    controls_one = [run_one.update_control(state, candidates, nonsmooth_mode=mode) for state, candidates, mode in trajectory]
    controls_two = [run_two.update_control(state, candidates, nonsmooth_mode=mode) for state, candidates, mode in trajectory]

    assert controls_one == controls_two
    assert [log.selected_subgradient_descriptor for log in run_one.tick_logs] == [
        log.selected_subgradient_descriptor for log in run_two.tick_logs
    ]
    assert [log.boundary_state for log in run_one.tick_logs] == [
        log.boundary_state for log in run_two.tick_logs
    ]


def test_boundary_policy_is_versioned_in_blueprint_config() -> None:
    import json
    from pathlib import Path

    blueprint = json.loads(Path("config/blueprint-v3.5.json").read_text())
    policy = blueprint["metadata"]["deterministicBoundaryControlPolicy"]

    assert policy["version"] == "1.0.0"
    assert policy["selectionRule"] == "minimum_norm_then_lexicographic"
