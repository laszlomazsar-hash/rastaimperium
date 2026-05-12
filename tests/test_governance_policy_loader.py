import json

import pytest

from src.governance.runtime import PolicyLoadError, load_runtime_policy
from src.codex.hypothesis_recovery import HypothesisRecoveryEngine


def test_policy_loader_parses_manifest_and_materializes_guards() -> None:
    policy = load_runtime_policy("config/governance_manifest.json")

    policy.guards.validate_transition("INGESTED", "NORMALIZED")
    policy.guards.validate_event_type("COMMIT_FINALIZED")
    policy.guards.validate_version_bundle(
        {
            "schema_version": policy.schema_version,
            "ruleset_version": policy.ruleset_version,
            "governance_version": policy.governance_version,
            "canon_spec_version": "1.0",
        }
    )


def test_policy_loader_fails_closed_on_missing_required_definitions(tmp_path) -> None:
    manifest = tmp_path / "bad_manifest.json"
    manifest.write_text(
        json.dumps(
            {
                "schema_version": "1.0",
                "ruleset_version": "2026.05",
                "governance_version": "v1",
                "guards": {
                    "fsm_transitions": {"INGESTED": ["NORMALIZED"]},
                    "event_types": ["STATE_TRANSITION"],
                    "required_version_bundle": ["schema_version"],
                },
            }
        )
    )

    with pytest.raises(PolicyLoadError):
        load_runtime_policy(manifest)


def test_commit_gate_initialization_fails_closed_on_missing_manifest() -> None:
    with pytest.raises(PolicyLoadError):
        HypothesisRecoveryEngine(governance_manifest_path="config/missing_manifest.json")
