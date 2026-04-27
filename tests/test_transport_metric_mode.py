from src.soulecho.v2 import (
    SoulEchoStreamEngine,
    TransportBudgetState,
    choose_transport_metric_mode,
)


def test_transport_mode_uses_explicit_budget_counters() -> None:
    realtime = choose_transport_metric_mode(
        TransportBudgetState(tick_budget_class=2, queue_depth=1, configured_cap=10)
    )
    constrained = choose_transport_metric_mode(
        TransportBudgetState(tick_budget_class=1, queue_depth=6, configured_cap=10)
    )
    saturated = choose_transport_metric_mode(
        TransportBudgetState(tick_budget_class=0, queue_depth=10, configured_cap=10)
    )

    assert realtime == "realtime"
    assert constrained == "batched"
    assert saturated == "deferred"


def test_transport_mode_tie_breaks_are_deterministic() -> None:
    boundary_state = TransportBudgetState(
        tick_budget_class=1,
        queue_depth=7,
        configured_cap=10,
    )

    # At this boundary both batched and deferred produce equal penalties;
    # tie-break priority keeps selection deterministic.
    assert choose_transport_metric_mode(boundary_state) == "batched"


def test_transport_mode_replay_is_identical_for_same_inputs() -> None:
    fixed_state = TransportBudgetState(tick_budget_class=1, queue_depth=8, configured_cap=10)

    def budget_provider(_: int) -> TransportBudgetState:
        return fixed_state

    engine = SoulEchoStreamEngine(budget_state_provider=budget_provider)

    first = engine.next_snapshot()
    second = engine.next_snapshot()

    assert first.transport_metric_mode == second.transport_metric_mode

    telemetry = engine.transport_mode_telemetry()
    assert telemetry[0].mode == telemetry[1].mode
    assert telemetry[0].budget_state == telemetry[1].budget_state
