from app.ark_engine.core.self_check import (
    attractor_existence_statement,
    build_condition_artifacts,
    required_attractor_conditions,
    summarize_attractor_verification,
)


def test_attractor_statement_and_required_conditions_are_explicit() -> None:
    assert (
        attractor_existence_statement()
        == "Under assumptions A..N, attractor existence follows from boundedness + dissipativity + continuity-like conditions."
    )
    assert required_attractor_conditions() == (
        "boundedness",
        "dissipativity",
        "continuity_like",
        "closed_map",
        "invariant_set",
    )


def test_verification_summary_distinguishes_proven_vs_empirical() -> None:
    artifacts = build_condition_artifacts(
        {
            "boundedness": {"proven": True, "evidence": "lemma-1"},
            "dissipativity": {"proven": True, "evidence": "lemma-2"},
            "continuity_like": {
                "empirically_observed": True,
                "evidence": "simulation-run-44",
            },
            "closed_map": {"proven": True, "evidence": "prop-7"},
            "invariant_set": {
                "empirically_observed": True,
                "evidence": "invariance-check.csv",
            },
        }
    )

    summary = summarize_attractor_verification(artifacts)

    assert summary["attractor_existence_proven"] is False
    assert summary["proven_conditions"] == ["boundedness", "dissipativity", "closed_map"]
    assert summary["empirical_only_conditions"] == ["continuity_like", "invariant_set"]
    assert summary["missing_conditions"] == []

    artifact_by_condition = {entry["condition"]: entry for entry in summary["artifacts"]}
    assert artifact_by_condition["continuity_like"]["status"] == "empirical_only"
    assert artifact_by_condition["invariant_set"]["status"] == "empirical_only"
