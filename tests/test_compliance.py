import pytest

from src.codex.compliance import (
    CalibrationReplayError,
    ComplianceEngine,
    DATASET_SNAPSHOT_FORMAT_VERSION,
    DatasetSnapshot,
    LINEAGE_SCHEMA_VERSION,
    LineageVerificationError,
    build_trust_root,
    create_lineage_record,
    verify_lineage_record,
)


def test_audit_record_uses_sha256_digest() -> None:
    engine = ComplianceEngine()
    record = engine.append_audit_record("admin", "deploy", "IV", {"release": "v3.6"})

    assert len(record.digest) == 64
    assert record in engine.audit_log


def test_rollback_trigger_when_trace_drops() -> None:
    engine = ComplianceEngine()
    engine.set_trace_coverage("L2", 72)

    assert engine.should_trigger_rollback() is True


def _dataset_snapshot() -> DatasetSnapshot:
    return DatasetSnapshot(
        format_version=DATASET_SNAPSHOT_FORMAT_VERSION,
        dataset_id="calibration-ds-2026-04-27",
        created_at="2026-04-27T00:00:00+00:00",
        source_uri="s3://imperium/calibration/snapshots/2026-04-27.jsonl",
        rows=[{"id": "1", "signal": 0.91}, {"id": "2", "signal": 0.88}],
    )


def test_lineage_verification_checks_signature_hash_and_schema() -> None:
    trust_root = build_trust_root({"k-2026-q2": "super-secret"})
    record = create_lineage_record(
        calibration_id="calib-001",
        dataset_snapshot=_dataset_snapshot(),
        artifact_versions={"model": "v3.6.0", "prompt_pack": "2026.04.27"},
        key_id="k-2026-q2",
        secret="super-secret",
    )

    verify_lineage_record(record, trust_root)
    assert record.schema_version == LINEAGE_SCHEMA_VERSION


def test_lineage_verification_fails_on_schema_drift() -> None:
    trust_root = build_trust_root({"k-2026-q2": "super-secret"})
    record = create_lineage_record(
        calibration_id="calib-001",
        dataset_snapshot=_dataset_snapshot(),
        artifact_versions={"model": "v3.6.0"},
        key_id="k-2026-q2",
        secret="super-secret",
    )

    drifted = record.__class__(**{**record.__dict__, "schema_version": "0.9.0"})
    with pytest.raises(LineageVerificationError, match="Unsupported lineage schema version"):
        verify_lineage_record(drifted, trust_root)


def test_replay_requires_exact_lineage_artifact_versions() -> None:
    trust_root = build_trust_root({"k-2026-q2": "super-secret"})
    record = create_lineage_record(
        calibration_id="calib-001",
        dataset_snapshot=_dataset_snapshot(),
        artifact_versions={"model": "v3.6.0", "prompt_pack": "2026.04.27"},
        key_id="k-2026-q2",
        secret="super-secret",
    )
    engine = ComplianceEngine()

    with pytest.raises(CalibrationReplayError, match="exact lineage artifact versions"):
        engine.replay_calibration(
            lineage_record=record,
            runtime_artifact_versions={"model": "v3.6.1", "prompt_pack": "2026.04.27"},
            trust_root=trust_root,
        )

    replay_result = engine.replay_calibration(
        lineage_record=record,
        runtime_artifact_versions={"model": "v3.6.0", "prompt_pack": "2026.04.27"},
        trust_root=trust_root,
    )
    assert replay_result["status"] == "replayed"
