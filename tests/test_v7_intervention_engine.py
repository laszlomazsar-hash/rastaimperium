from backend.src.ark_safety.intervention_engine import InterventionState, V7InterventionEngine


def test_below_trigger_stays_in_observe_mode() -> None:
    engine = V7InterventionEngine(trigger_threshold=0.6, critical_threshold=0.85)
    state = InterventionState(
        drift_score=0.3,
        containment_score=0.9,
        rollback_ready=0.9,
        human_approval=True,
        lyapunov_margin=0.1,
    )

    decision = engine.decide(state)

    assert decision.action == "observe"
    assert decision.intervention_allowed is False
    assert decision.reason == "below_trigger_threshold"


def test_triggered_without_human_approval_queues_review() -> None:
    engine = V7InterventionEngine(trigger_threshold=0.5, critical_threshold=0.8)
    state = InterventionState(
        drift_score=0.95,
        containment_score=0.1,
        rollback_ready=0.3,
        human_approval=False,
        lyapunov_margin=0.2,
    )

    decision = engine.decide(state)

    assert decision.recovery_score >= 0.5
    assert decision.action == "queue_review"
    assert decision.intervention_allowed is False


def test_critical_score_with_approval_executes_rollback() -> None:
    engine = V7InterventionEngine(trigger_threshold=0.5, critical_threshold=0.75)
    state = InterventionState(
        drift_score=1.0,
        containment_score=0.0,
        rollback_ready=0.0,
        human_approval=True,
        lyapunov_margin=0.05,
    )

    decision = engine.decide(state)

    assert decision.recovery_score == 1.0
    assert decision.action == "rollback"
    assert decision.intervention_allowed is True


def test_negative_lyapunov_margin_blocks_intervention() -> None:
    engine = V7InterventionEngine()
    state = InterventionState(
        drift_score=1.0,
        containment_score=0.0,
        rollback_ready=0.0,
        human_approval=True,
        lyapunov_margin=-0.0001,
    )

    decision = engine.decide(state)

    assert decision.action == "hold"
    assert decision.intervention_allowed is False
    assert decision.reason == "lyapunov_guard_negative_margin"
