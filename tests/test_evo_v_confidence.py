from app.ark_engine.evo_v_nextgen import NeurosymbolicCulturalReasoner


def _confidence(drift: float, anomaly: float, policy_uncertainty: float = 0.0) -> float:
    reasoner = NeurosymbolicCulturalReasoner()
    return reasoner._calculate_integrated_confidence(
        neural_patterns=[{"id": "n1"}, {"id": "n2"}, {"id": "n3"}],
        symbolic_rules=[{"id": "s1"}, {"id": "s2"}],
        causal_structure={
            "causal_graph": {"a": ["b"], "b": ["c"]},
            "metrics": {
                "drift": drift,
                "anomaly": anomaly,
                "policy_uncertainty": policy_uncertainty,
            },
        },
    )


def test_confidence_is_clamped_to_unit_interval() -> None:
    assert _confidence(drift=-10.0, anomaly=-1.0, policy_uncertainty=-2.0) == 0.6
    assert _confidence(drift=1.0, anomaly=1.0, policy_uncertainty=1.0) == 0.0


def test_confidence_monotonic_decreases_with_drift() -> None:
    low_drift = _confidence(drift=0.1, anomaly=0.2, policy_uncertainty=0.2)
    high_drift = _confidence(drift=0.6, anomaly=0.2, policy_uncertainty=0.2)
    assert high_drift <= low_drift


def test_confidence_monotonic_decreases_with_anomaly() -> None:
    low_anomaly = _confidence(drift=0.2, anomaly=0.1, policy_uncertainty=0.2)
    high_anomaly = _confidence(drift=0.2, anomaly=0.6, policy_uncertainty=0.2)
    assert high_anomaly <= low_anomaly


def test_policy_uncertainty_is_penalty_not_boost() -> None:
    low_uncertainty = _confidence(drift=0.2, anomaly=0.2, policy_uncertainty=0.0)
    high_uncertainty = _confidence(drift=0.2, anomaly=0.2, policy_uncertainty=0.8)
    assert high_uncertainty <= low_uncertainty
