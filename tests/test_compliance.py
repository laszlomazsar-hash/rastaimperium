from src.codex.compliance import AuditRecord, ComplianceEngine


def test_audit_record_uses_sha256_digest() -> None:
    engine = ComplianceEngine()
    record = engine.append_audit_record("admin", "deploy", "IV", {"release": "v3.6"})

    assert len(record.digest) == 64
    assert record in engine.audit_log


def test_rollback_trigger_when_trace_drops() -> None:
    engine = ComplianceEngine()
    engine.set_trace_coverage("L2", 72)

    assert engine.should_trigger_rollback() is True


def test_canonical_snapshot_bytes_are_order_invariant_with_duplicate_rows() -> None:
    left = ComplianceEngine()
    right = ComplianceEngine()

    duplicated_row = {
        "actor": "svc-a",
        "action": "promote",
        "article": "III",
        "metadata": {"release": "v3.6.0"},
        "timestamp": "2026-04-27T00:00:00+00:00",
        "digest": "abc123",
    }
    unique_row = {
        "actor": "svc-b",
        "action": "validate",
        "article": "II",
        "metadata": {"suite": "cross-impl"},
        "timestamp": "2026-04-27T00:01:00+00:00",
        "digest": "def456",
    }

    left._audit_log = [  # type: ignore[attr-defined]
        AuditRecord(**duplicated_row),
        AuditRecord(**unique_row),
        AuditRecord(**duplicated_row),
    ]
    right._audit_log = [  # type: ignore[attr-defined]
        AuditRecord(**unique_row),
        AuditRecord(**duplicated_row),
        AuditRecord(**duplicated_row),
    ]

    assert left.canonical_audit_snapshot_bytes() == right.canonical_audit_snapshot_bytes()
