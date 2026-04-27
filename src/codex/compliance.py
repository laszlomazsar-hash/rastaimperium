from __future__ import annotations

import hashlib
import math
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any, Dict, List
import unicodedata

CANONICALIZATION_VERSION = "1.0"


@dataclass
class AuditRecord:
    actor: str
    action: str
    article: str
    metadata: Dict[str, object]
    timestamp: str
    canonical_manifest: Dict[str, str]
    digest: str


class ComplianceEngine:
    """Article II-IV observability + audit logging + rollback triggers."""

    def __init__(self) -> None:
        self._audit_log: List[AuditRecord] = []
        self._trace_coverage: Dict[str, float] = {f"L{i}": 100.0 for i in range(1, 10)}

    def append_audit_record(self, actor: str, action: str, article: str, metadata: Dict[str, object]) -> AuditRecord:
        timestamp = datetime.now(timezone.utc).isoformat()
        manifest = {
            "algorithm": "sha256",
            "canonicalization_version": CANONICALIZATION_VERSION,
            "field_order": "lexicographic",
            "float_format": "ieee754-17g-normalized",
            "newline_rule": "lf",
            "string_normalization": "unicode-nfc-utf8",
        }
        payload = {
            "actor": actor,
            "action": action,
            "article": article,
            "metadata": metadata,
            "timestamp": timestamp,
            "manifest": manifest,
        }
        digest = sha256_canonical_digest(payload)
        record = AuditRecord(
            actor=actor,
            action=action,
            article=article,
            metadata=metadata,
            timestamp=timestamp,
            canonical_manifest=manifest,
            digest=digest,
        )
        self._audit_log.append(record)
        return record

    def set_trace_coverage(self, layer: str, coverage: float) -> None:
        self._trace_coverage[layer] = max(0.0, min(100.0, coverage))

    def trace_coverage_graph(self) -> List[Dict[str, float]]:
        return [{"layer": layer, "coverage": value} for layer, value in sorted(self._trace_coverage.items())]

    def should_trigger_rollback(self) -> bool:
        return any(v < 80.0 for v in self._trace_coverage.values())

    @property
    def audit_log(self) -> List[AuditRecord]:
        return list(self._audit_log)


def sha256_canonical_digest(payload: Any) -> str:
    canonical = canonical_json(payload)
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()


def canonical_json(payload: Any) -> str:
    normalized = _normalize_value(payload)
    return _encode_json(normalized)


def _normalize_value(value: Any) -> Any:
    if value is None or isinstance(value, bool):
        return value
    if isinstance(value, int):
        return value
    if isinstance(value, float):
        return _normalize_float(value)
    if isinstance(value, str):
        return _normalize_string(value)
    if isinstance(value, dict):
        normalized_dict = {_normalize_string(str(k)): _normalize_value(v) for k, v in value.items()}
        normalized_dict = _normalize_dataset_block(normalized_dict)
        return {k: normalized_dict[k] for k in sorted(normalized_dict.keys())}
    if isinstance(value, (list, tuple)):
        return [_normalize_value(v) for v in value]
    raise TypeError(f"Unsupported value type for canonical hashing: {type(value)!r}")


def _normalize_dataset_block(value: Dict[str, Any]) -> Dict[str, Any]:
    schema = value.get("schema")
    rows = value.get("rows")
    if not isinstance(schema, list) or not isinstance(rows, list):
        return value
    if not all(isinstance(column, str) for column in schema):
        return value
    if not all(isinstance(row, dict) for row in rows):
        return value

    sorted_schema = sorted(schema)
    canonical_rows: List[Dict[str, Any]] = []
    for row in rows:
        row_values = {k: row[k] for k in sorted(row.keys())}
        ordered_row: Dict[str, Any] = {}
        for column in sorted_schema:
            if column in row_values:
                ordered_row[column] = _normalize_value(row_values[column])
        for extra_key in sorted(k for k in row_values.keys() if k not in sorted_schema):
            ordered_row[extra_key] = _normalize_value(row_values[extra_key])
        canonical_rows.append(ordered_row)

    canonical_rows.sort(key=_encode_json)
    value["schema"] = sorted_schema
    value["rows"] = canonical_rows
    return value


def _normalize_string(value: str) -> str:
    lf_normalized = value.replace("\r\n", "\n").replace("\r", "\n")
    return unicodedata.normalize("NFC", lf_normalized)


def _normalize_float(value: float) -> str:
    if not math.isfinite(value):
        raise ValueError("Non-finite float values are not supported in canonical hashing")
    if value == 0.0:
        return "0"
    text = format(value, ".17g")
    if "E" in text:
        text = text.replace("E", "e")
    if "e" in text:
        base, exp = text.split("e", 1)
        text = f"{base}e{int(exp)}"
    return text


def _encode_json(value: Any) -> str:
    if value is None:
        return "null"
    if value is True:
        return "true"
    if value is False:
        return "false"
    if isinstance(value, int):
        return str(value)
    if isinstance(value, str):
        return _quote_string(value)
    if isinstance(value, list):
        return "[" + ",".join(_encode_json(v) for v in value) + "]"
    if isinstance(value, dict):
        return "{" + ",".join(f"{_quote_string(k)}:{_encode_json(v)}" for k, v in value.items()) + "}"
    raise TypeError(f"Unsupported normalized type during JSON encoding: {type(value)!r}")


def _quote_string(value: str) -> str:
    escapes = {
        '"': '\\"',
        "\\": "\\\\",
        "\b": "\\b",
        "\f": "\\f",
        "\n": "\\n",
        "\r": "\\r",
        "\t": "\\t",
    }
    out = ['"']
    for char in value:
        if char in escapes:
            out.append(escapes[char])
            continue
        codepoint = ord(char)
        if codepoint <= 0x1F:
            out.append(f"\\u{codepoint:04x}")
            continue
        out.append(char)
    out.append('"')
    return "".join(out)
