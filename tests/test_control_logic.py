from src.ark_safety.control_logic import DirectionalProbe, decide_action, estimate_g_hat


def test_estimate_g_hat_from_directional_probes_single_estimator() -> None:
    probes = [
        DirectionalProbe(direction=0.8, confidence=1.0),
        DirectionalProbe(direction=-0.1, confidence=0.5),
    ]

    g_hat = estimate_g_hat(probes)
    assert round(g_hat, 3) == 0.5


def test_decide_action_recover_when_estimator_negative_beyond_band() -> None:
    decision = decide_action([DirectionalProbe(direction=-0.9, confidence=0.9)])
    assert decision.action == "recover"


def test_decide_action_steady_on_empty_probe_list() -> None:
    decision = decide_action([])
    assert decision.g_hat == 0.0
    assert decision.action == "steady"
