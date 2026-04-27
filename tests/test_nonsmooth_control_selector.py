from app.ark_engine.core.nonsmooth_control_selector import NonsmoothControlSelector


def test_selector_generates_finite_candidates_with_deterministic_order() -> None:
    selector = NonsmoothControlSelector(active_tolerance=0.05)

    certificate = selector.select(
        active_face_values=[1.0, 1.03, 1.3],
        active_face_gradients=[(1.0, 0.0), (0.0, 1.0), (2.0, 2.0)],
        directional_samples=[((1.0, 1.0), 0.5)],
        local_model_vertices=[(0.5, 0.5), (1.0, 0.0)],
    )

    assert certificate.candidate_set_size == 4
    assert certificate.chosen_index == 0
    assert certificate.ordered_candidates[0].vector == (0.353553390593, 0.353553390593)


def test_selector_certifies_error_bound_and_replay_metadata() -> None:
    selector = NonsmoothControlSelector(
        active_tolerance=0.01,
        directional_gap_bound=0.03,
        convex_hull_gap_bound=0.02,
    )

    certificate = selector.select(
        active_face_values=[0.0, 0.005],
        active_face_gradients=[(1.0, 0.0), (0.0, 1.0)],
        directional_samples=[((0.0, 1.0), 0.2)],
        local_model_vertices=[(0.5, 0.5)],
    )

    assert certificate.approximation_error_bound == 0.03
    assert len(certificate.replay_digest) == 64
    assert all(c in "0123456789abcdef" for c in certificate.replay_digest)


def test_selector_rejects_invalid_active_face_inputs() -> None:
    selector = NonsmoothControlSelector()

    try:
        selector.select(active_face_values=[], active_face_gradients=[])
    except ValueError as exc:
        assert "required" in str(exc)
    else:
        raise AssertionError("Expected ValueError for empty active-face inputs")
