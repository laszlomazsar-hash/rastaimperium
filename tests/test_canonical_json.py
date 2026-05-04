import hashlib
import json
from pathlib import Path

import pytest

from src.codex.canonical_json import canonicalize_float, dumps_canonical
from codex.compliance import ComplianceEngine


@pytest.mark.parametrize(
    ("value", "expected"),
    [(2.675, "2.675"), (0.125, "0.125"), (-0.0, "0")],
)
def test_canonicalize_float_rounding_and_negative_zero(value: float, expected: str) -> None:
    assert canonicalize_float(value) == expected


def test_canonical_float_vectors_conformance() -> None:
    vectors = json.loads(Path("tests/fixtures/canonical_float_vectors.json").read_text())

    for vector in vectors:
        assert canonicalize_float(vector["value"]) == vector["canonical"], vector["note"]


def test_canonical_json_key_sort_and_number_format() -> None:
    payload = {"b": 1.23, "a": -0.0, "nested": {"z": 1000000.0, "y": 1e-7}}

    assert dumps_canonical(payload) == '{"a":0,"b":1.23,"nested":{"y":1e-07,"z":1000000}}'


def test_compliance_digest_uses_canonical_float_serialization(monkeypatch: pytest.MonkeyPatch) -> None:
    engine = ComplianceEngine()

    class _FrozenDatetime:
        @classmethod
        def now(cls, tz):
            from datetime import datetime

            return datetime(2026, 4, 27, 12, 0, 0, tzinfo=tz)

    monkeypatch.setattr("codex.compliance.datetime", _FrozenDatetime)
    record = engine.append_audit_record(
        "auditor",
        "calibrate",
        "II",
        {"tiny": 1e-7, "neg_zero": -0.0, "big": 123456789012345678901.0},
    )

    expected_payload = {
        "actor": "auditor",
        "action": "calibrate",
        "article": "II",
        "metadata": {"tiny": 1e-7, "neg_zero": -0.0, "big": 123456789012345678901.0},
        "timestamp": "2026-04-27T12:00:00+00:00",
    }
    expected_digest = hashlib.sha256(dumps_canonical(expected_payload).encode("utf-8")).hexdigest()

    assert record.digest == expected_digest
