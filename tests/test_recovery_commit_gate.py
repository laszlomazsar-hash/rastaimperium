from datetime import datetime, timedelta, timezone

from src.codex.hypothesis_recovery import HypothesisPolicy, HypothesisRecoveryEngine


def test_empty_state_bootstrap_recovers_to_policy_min_and_commits() -> None:
    engine = HypothesisRecoveryEngine(HypothesisPolicy(min_viable_hypotheses=3))

    recovered = engine.recover_hypotheses([])

    assert len(recovered) == 3
    assert engine.commit_gate(recovered)


def test_temporary_bootstrap_mode_allows_lower_count_then_escalates() -> None:
    policy = HypothesisPolicy(
        min_viable_hypotheses=3,
        temporary_bootstrap_min_hypotheses=1,
        bootstrap_grace_period_seconds=60,
    )
    engine = HypothesisRecoveryEngine(policy)
    start = datetime(2026, 1, 1, tzinfo=timezone.utc)

    recovered = engine.recover_hypotheses(["h1"], allow_temporary_bootstrap=True, now=start)
    assert recovered == ["h1"]
    assert engine.commit_gate(recovered, allow_temporary_bootstrap=True, now=start)

    after_expiry = start + timedelta(seconds=61)
    assert not engine.commit_gate(recovered, allow_temporary_bootstrap=True, now=after_expiry)

    escalated = engine.recover_hypotheses(recovered, allow_temporary_bootstrap=True, now=after_expiry)
    assert len(escalated) == policy.min_viable_hypotheses
    assert engine.commit_gate(escalated, now=after_expiry)


def test_prune_fallback_and_commit_gate_share_policy_rule() -> None:
    policy = HypothesisPolicy(min_viable_hypotheses=2)
    engine = HypothesisRecoveryEngine(policy)

    pruned = engine.prune_hypotheses(["a", "a", " "])
    assert pruned == ["a"]

    recovered = engine.recover_hypotheses(pruned)
    assert len(recovered) == policy.min_viable_hypotheses
    assert engine.commit_gate(recovered)
