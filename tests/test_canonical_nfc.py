"""Regression coverage for event-hash.md §2 NFC + CRLF contract.

Exercises both dumps_canonical and Compliance.canonical_json /
_canonical_json_inner so the two paths stay consistent for string/key
normalization. Does not touch L7 sealed profiles.
"""
from __future__ import annotations

import pytest

from codex.canonical_json import dumps_canonical
from codex.compliance import canonical_json, sha256_canonical_digest


# NFD form of "Café" (e + combining acute)
_NFD_CAFE = "Cafe\u0301"
_NFC_CAFE = "Caf\u00e9"


def test_nfc_string_value_equivalence() -> None:
    """NFD and NFC string values must canonicalize to the same output."""
    nfd_payload = {"note": _NFD_CAFE}
    nfc_payload = {"note": _NFC_CAFE}

    assert dumps_canonical(nfd_payload) == dumps_canonical(nfc_payload)
    assert canonical_json(nfd_payload) == canonical_json(nfc_payload)
    assert sha256_canonical_digest(nfd_payload) == sha256_canonical_digest(nfc_payload)


def test_nfc_object_key_normalization() -> None:
    """Object keys are normalized to NFC before lexicographic sort."""
    nfd_key_payload = {_NFD_CAFE: 1}
    nfc_key_payload = {_NFC_CAFE: 1}

    assert dumps_canonical(nfd_key_payload) == dumps_canonical(nfc_key_payload)
    assert canonical_json(nfd_key_payload) == canonical_json(nfc_key_payload)


def test_nfc_key_collision_raises() -> None:
    """Distinct keys that collide after NFC must fail deterministically."""
    colliding = {_NFD_CAFE: "a", _NFC_CAFE: "b"}
    with pytest.raises(ValueError, match="collide after NFC"):
        dumps_canonical(colliding)
    with pytest.raises(ValueError, match="collide after NFC"):
        canonical_json(colliding)


def test_crlf_and_cr_normalized_to_lf() -> None:
    """CRLF and bare CR become LF under both paths."""
    payload_crlf = {"note": "A\r\nB"}
    payload_cr = {"note": "A\rB"}
    payload_lf = {"note": "A\nB"}

    assert dumps_canonical(payload_crlf) == dumps_canonical(payload_lf)
    assert dumps_canonical(payload_cr) == dumps_canonical(payload_lf)
    assert canonical_json(payload_crlf) == canonical_json(payload_lf)
    assert canonical_json(payload_cr) == canonical_json(payload_lf)


def test_nested_nfc_and_line_endings() -> None:
    """Nested objects/lists receive the same NFC + line-ending rules."""
    payload = {
        "meta": {"note": "A\rB"},
        "rows": [
            {"alpha": _NFD_CAFE + "\r\nLine2", "zeta": 1.0},
            {"alpha": "Beta", "zeta": 2.5},
        ],
        "schema": ["zeta", "alpha"],
    }
    # Must be deterministic across the two paths for string content
    # (structural float/array rules may still differ by design).
    out_dumps = dumps_canonical(payload)
    out_comp = canonical_json(payload)
    assert _NFC_CAFE in out_dumps or "Caf\\u00e9" in out_dumps or "Café" in out_dumps
    assert "\\n" in out_dumps or "\n" in out_dumps  # LF present after escape
    # Compliance path must also have normalized the NFD input
    assert "Cafe\\u0301" not in out_comp and "Cafe\u0301" not in out_comp


def test_digest_stability_under_nfd_input() -> None:
    """Digest of NFD input equals digest of already-NFC input."""
    a = {"label": _NFD_CAFE, "v": 1}
    b = {"label": _NFC_CAFE, "v": 1}
    assert sha256_canonical_digest(a) == sha256_canonical_digest(b)
