from app.ark_engine.evo_v_nextgen import CulturalAnalyticsDashboard


def test_snapshot_projects_state_and_canonicalizes_metadata() -> None:
    dashboard = CulturalAnalyticsDashboard()
    snapshot = dashboard.system_status_snapshot(
        {
            "run_id": "Run-ID-" + ("X" * 200),
            "lineage": ["Root Node", "Branch A", "Leaf B"],
            "label": "  Primary Label  ",
        }
    )

    projected_state = snapshot["projected_state"]
    metadata_class = projected_state["metadata_equivalence_class"]
    dynamic = projected_state["dynamical_coordinates"]

    assert len(metadata_class["run_id"]) <= dashboard._MAX_IDENTIFIER_LENGTH
    assert metadata_class["lineage"] == ["root_node", "branch_a", "leaf_b"]
    assert metadata_class["label"] == "primary_label"
    assert 0.0 <= dynamic["normalized_progress"] <= 1.0
    assert projected_state["compactness_claim"]


def test_lineage_depth_is_bounded_in_projection() -> None:
    dashboard = CulturalAnalyticsDashboard()
    long_lineage = [f"node_{i}" for i in range(40)]

    snapshot = dashboard.system_status_snapshot({"lineage": long_lineage})
    projected_lineage = snapshot["projected_state"]["metadata_equivalence_class"]["lineage"]

    assert len(projected_lineage) == dashboard._MAX_LINEAGE_DEPTH
