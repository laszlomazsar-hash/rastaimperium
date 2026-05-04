from src.soulecho.regime_switching import PhaseThreshold, RegimePhaseSwitcher


def _switcher(min_dwell_ticks: int = 0) -> RegimePhaseSwitcher:
    return RegimePhaseSwitcher(
        phase_order=["normal", "guarded", "critical"],
        thresholds={
            "normal": PhaseThreshold(enter=0.0, exit=0.0),
            "guarded": PhaseThreshold(enter=0.55, exit=0.45),
            "critical": PhaseThreshold(enter=0.85, exit=0.70),
        },
        min_dwell_ticks=min_dwell_ticks,
    )


def test_hysteresis_separate_enter_and_exit_thresholds() -> None:
    s = _switcher()

    assert s.update(0.56) == "guarded"
    # No drop despite slight dip; exit threshold for guarded is 0.45.
    assert s.update(0.50) == "guarded"
    assert s.update(0.44) == "normal"


def test_min_dwell_ticks_blocks_early_phase_change() -> None:
    s = _switcher(min_dwell_ticks=2)

    assert s.update(0.56) == "normal"  # blocked by dwell requirement at startup
    assert s.update(0.56) == "guarded"  # dwell satisfied now
    assert s.phase_entered_at == 2

    # De-escalation signal appears quickly but is blocked by dwell.
    assert s.update(0.10) == "guarded"
    assert s.update(0.10) == "normal"


def test_transition_reason_and_events_for_audit_and_replay() -> None:
    s = _switcher()

    s.update(0.90, reason="crossed critical contradiction gate")

    assert s.current_phase == "critical"
    assert s.phase_entered_at == 1
    assert s.last_transition_reason == "crossed critical contradiction gate"

    events = s.replayable_transitions()
    assert events == [
        {
            "tick": 1,
            "from_phase": "normal",
            "to_phase": "critical",
            "contradiction_signal": 0.90,
            "reason": "crossed critical contradiction gate",
        }
    ]
