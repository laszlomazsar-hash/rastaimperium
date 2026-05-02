from datetime import datetime, timedelta, timezone

from src.soulecho.v2 import SoulEchoStreamEngine


class DeterministicSoulEchoStreamEngine(SoulEchoStreamEngine):
    def __init__(self, policy_signals: list[float], **kwargs) -> None:
        super().__init__(**kwargs)
        self._policy_signals = policy_signals
        self._index = 0

    def _policy_signal(self, livity_score: float) -> float:
        signal = self._policy_signals[min(self._index, len(self._policy_signals) - 1)]
        self._index += 1
        return signal


def test_policy_updates_on_fixed_cadence_not_every_write() -> None:
    engine = DeterministicSoulEchoStreamEngine([95.0, 95.0], policy_update_interval_seconds=60)
    start = datetime(2026, 1, 1, tzinfo=timezone.utc)

    first = engine.next_snapshot(now=start)
    second = engine.next_snapshot(now=start + timedelta(seconds=10))

    assert len(first.policy_deltas) == 1
    assert second.policy_deltas == []


def test_policy_step_uses_delta_limit() -> None:
    engine = DeterministicSoulEchoStreamEngine(
        [95.0, 95.0],
        policy_update_interval_seconds=60,
        delta_limit=0.5,
    )
    start = datetime(2026, 1, 1, tzinfo=timezone.utc)

    first = engine.next_snapshot(now=start)
    second = engine.next_snapshot(now=start + timedelta(seconds=60))

    assert first.policy_deltas[0].reason_code in {"delta_clamped", "bounded_step"}
    assert abs(first.policy_deltas[0].delta) <= 0.5
    assert second.policy_deltas[0].reason_code in {"delta_clamped", "bounded_step"}
    assert abs(second.policy_deltas[0].delta) <= 0.5


def test_policy_hysteresis_holds_small_adjustments() -> None:
    engine = DeterministicSoulEchoStreamEngine([92.0], hysteresis_band=0.2)
    start = datetime(2026, 1, 1, tzinfo=timezone.utc)

    snapshot = engine.next_snapshot(now=start)

    assert snapshot.policy_deltas[0].reason_code == "hysteresis_hold"
    assert snapshot.policy_deltas[0].delta == 0.0


def test_policy_cooldown_prevents_rapid_oscillation() -> None:
    engine = DeterministicSoulEchoStreamEngine(
        [95.0, 70.0, 95.0],
        policy_update_interval_seconds=60,
        cooldown_seconds=180,
        delta_limit=1.0,
        hysteresis_band=0.05,
    )
    start = datetime(2026, 1, 1, tzinfo=timezone.utc)

    first = engine.next_snapshot(now=start)
    second = engine.next_snapshot(now=start + timedelta(seconds=60))
    third = engine.next_snapshot(now=start + timedelta(seconds=120))

    assert first.policy_deltas[0].reason_code in {"bounded_step", "delta_clamped"}
    assert second.policy_deltas[0].reason_code == "cooldown_hold"
    assert third.policy_deltas[0].reason_code == "cooldown_hold"
    assert third.policy_deltas[0].delta == 0.0
