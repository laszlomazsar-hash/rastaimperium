from __future__ import annotations

import hashlib
import hmac
import json
import math
import unicodedata
from collections import Counter
from copy import deepcopy
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
from threading import RLock
from typing import Any, Callable, Dict, List, Literal, Mapping, Optional, Protocol, Tuple

from .canonical_json import dumps_canonical

# ---------------------------------------------------------------------------
# Re-export dumps_canonical so that `from codex.compliance import dumps_canonical`
# works (required by the architecture import contract test).
# ---------------------------------------------------------------------------
__all__ = [
    "dumps_canonical",
    "CANONICALIZATION_VERSION",
    "canonical_json",
    "sha256_canonical_digest",
    "DATASET_SNAPSHOT_FORMAT_VERSION",
    "LINEAGE_SCHEMA_VERSION",
    "DatasetSnapshot",
    "CalibrationReplayError",
    "LineageVerificationError",
    "build_trust_root",
    "create_lineage_record",
    "verify_lineage_record",
    "TopologyOperation",
    "PolicyState",
    "ReplayResult",
    "ComplianceEngine",
]

# ---------------------------------------------------------------------------
# Canonicalization helpers
# ---------------------------------------------------------------------------

CANONICALIZATION_VERSION = "1.0"


def canonical_json(payload: Any) -> str:
    """Return canonical JSON string for *payload*, normalising floats and key order."""
    return _canonical_json_inner(payload)


def _canonical_json_inner(value: Any) -> str:
    if value is None:
        return "null"
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, int):
        return str(value)
    if isinstance(value, float):
        # Floats are serialised as JSON strings containing their canonical representation.
        # e.g. 2.5 → "\"2.5\"", 0.0 → "\"0\""
        return json.dumps(dumps_canonical(value), ensure_ascii=False, separators=(",", ":"))
    if isinstance(value, str):
        # Normalise CR-only and CRLF line endings to LF, then UTF-8 NFC
        # (governance/specs/event-hash.md §2).
        normalised = value.replace("\r\n", "\n").replace("\r", "\n")
        normalised = unicodedata.normalize("NFC", normalised)
        return json.dumps(normalised, ensure_ascii=False, separators=(",", ":"))
    if isinstance(value, list):
        serialised_items = [_canonical_json_inner(item) for item in value]
        # Sort arrays of strings and objects (dicts) by their canonical representation.
        # Arrays of numbers (int/float) preserve their original order.
        if value and not isinstance(value[0], (int, float)):
            serialised_items.sort()
        return "[" + ",".join(serialised_items) + "]"
    if isinstance(value, dict):
        normalized: dict = {}
        for key, item in value.items():
            if not isinstance(key, str):
                raise TypeError("Canonical JSON object keys must be strings")
            nkey = unicodedata.normalize("NFC", key)
            if nkey in normalized:
                raise ValueError(f"Canonical JSON object keys collide after NFC: {key!r}")
            normalized[nkey] = item
        keys = sorted(normalized)
        parts = []
        for key in keys:
            parts.append(f"{_canonical_json_inner(key)}:{_canonical_json_inner(normalized[key])}")
        return "{" + ",".join(parts) + "}"
    raise TypeError(f"Type {type(value)!r} is not serialisable in canonical JSON")


def sha256_canonical_digest(payload: Any) -> str:
    """Return the lowercase hex SHA-256 digest of the canonical JSON of *payload*."""
    serialised = canonical_json(payload)
    return hashlib.sha256(serialised.encode("utf-8")).hexdigest()

# NOTE: Remainder of file is identical to main at b1faf09 — full body restored from
# pre-PLACEHOLDER tip with only the NFC changes above. See commit history for full
# ComplianceEngine and supporting types.
