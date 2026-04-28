from app.ark_engine.evo_v_nextgen import DeterministicJumpResolver, JumpCandidate


def test_jump_resolution_uses_strict_priority_order() -> None:
    resolver = DeterministicJumpResolver()
    candidates = [
        JumpCandidate("jump-2", "exploration", belief_rank=99, operation_timestamp_bucket=4),
        JumpCandidate("jump-3", "correction", belief_rank=5, operation_timestamp_bucket=1),
        JumpCandidate("jump-1", "safety", belief_rank=1, operation_timestamp_bucket=9),
    ]

    decision = resolver.resolve(candidates)

    assert decision.selected_jump is not None
    assert decision.selected_jump.jump_id == "jump-1"
    assert [candidate.jump_id for candidate in decision.discarded_candidates] == ["jump-3", "jump-2"]
    assert decision.decision_log["selected_jump"]["jump_id"] == "jump-1"
    assert [candidate["jump_id"] for candidate in decision.decision_log["discarded_candidates"]] == [
        "jump-3",
        "jump-2",
    ]


def test_jump_resolution_tie_break_is_deterministic_for_identical_state() -> None:
    resolver = DeterministicJumpResolver()
    state_candidates = [
        JumpCandidate("jump-c", "correction", belief_rank=4, operation_timestamp_bucket=2),
        JumpCandidate("jump-a", "correction", belief_rank=5, operation_timestamp_bucket=6),
        JumpCandidate("jump-b", "correction", belief_rank=5, operation_timestamp_bucket=3),
    ]

    first = resolver.resolve(state_candidates)
    second = resolver.resolve(list(reversed(state_candidates)))

    assert first.selected_jump is not None
    assert second.selected_jump is not None
    assert first.selected_jump.jump_id == "jump-a"
    assert second.selected_jump.jump_id == first.selected_jump.jump_id
    assert first.decision_log == second.decision_log
