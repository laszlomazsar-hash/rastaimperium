"""Bounded ri-ops-runtime-v1 operational producer (in-process).

Observes only: this process completed an emit cycle.
Does NOT claim LIVE, production authority, or full EVO-V health.
Sequence is per process instance (resets on restart).
"""
from __future__ import annotations

import hashlib
import json
import threading
from datetime import datetime, timezone
from typing import Any
from uuid import uuid4

PRODUCER_ID = "ri-ops-runtime-v1"
PRODUCER_VERSION = "0.1.0"
SCHEMA_VERSION = "ri-ops-event-0.1.0"
EVENT_TYPE = "OPS_HEARTBEAT"
ENVIRONMENT = "runtime-public"
SCOPE = "bounded-ops-heartbeat;not-evo-v-full-health;not-production-authority"
INVARIANT_ID = "INV-OPS-001"

_lock = threading.Lock()
_sequence = 0
_latest: dict[str, Any] | None = None


def canonicalize(value: Any) -> str:
    if value is None:
        return "null"
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        if isinstance(value, float) and (value != value or value in (float("inf"), float("-inf"))):
            raise ValueError("rejectNonFiniteNumbers")
        return json.dumps(value)
    if isinstance(value, str):
        return json.dumps(value, ensure_ascii=False)
    if isinstance(value, list):
        return "[" + ",".join(canonicalize(v) for v in value) + "]"
    if isinstance(value, dict):
        keys = sorted(value.keys())
        return (
            "{"
            + ",".join(f"{json.dumps(k, ensure_ascii=False)}:{canonicalize(value[k])}" for k in keys)
            + "}"
        )
    raise TypeError(f"unsupported type {type(value)}")


def sha256_hex(s: str) -> str:
    return hashlib.sha256(s.encode("utf-8")).hexdigest()


def public_payload_for_digest(record: dict[str, Any]) -> dict[str, Any]:
    return {
        "schemaVersion": record["schemaVersion"],
        "artifactId": record.get("artifactId"),
        "invariantId": record["invariantId"],
        "eventId": record["eventId"],
        "producerId": record["producerId"],
        "producerVersion": record["producerVersion"],
        "eventType": record["eventType"],
        "observedAt": record["observedAt"],
        "sequence": record["sequence"],
        "scope": record["scope"],
        "environment": record["environment"],
        "payload": record["payload"],
        "limitations": record["limitations"],
        "productionAuthority": record["productionAuthority"],
        "status": record["status"],
    }


def emit_record() -> dict[str, Any]:
    global _sequence, _latest
    with _lock:
        _sequence += 1
        seq = _sequence
        observed_at = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"
        event_id = f"ops-hb-{observed_at.replace(':', '-').replace('.', '-')}-{uuid4().hex[:8]}"
        base: dict[str, Any] = {
            "schemaVersion": SCHEMA_VERSION,
            "artifactId": "ART-OPS-RUNTIME-CURRENT",
            "invariantId": INVARIANT_ID,
            "eventId": event_id,
            "producerId": PRODUCER_ID,
            "producerVersion": PRODUCER_VERSION,
            "eventType": EVENT_TYPE,
            "observedAt": observed_at,
            "sequence": seq,
            "scope": SCOPE,
            "environment": ENVIRONMENT,
            "payload": {
                "note": "Runtime producer completed one emit cycle. Bounded demonstrator only.",
                "emitKind": "heartbeat",
            },
            "limitations": [
                "Does not establish LIVE continuous telemetry until LIVE gates pass.",
                "Does not establish production authority or production monitoring.",
                "Does not establish full EVO-V runtime health or enforcement.",
                "Sequence is per process instance only (resets on restart; not globally persistent).",
                "Producer identity is process-scoped, not institutional authorization.",
                "/health is a separate signal and is not this operational evidence source.",
            ],
            "productionAuthority": False,
            "status": "OPERATIONAL_BOUNDED",
        }
        digest = sha256_hex(canonicalize(public_payload_for_digest(base)))
        record = {
            **base,
            "integrity": {
                "algorithm": "sha256",
                "canonicalization": "json-canonical-sorted-keys-1",
                "digest": digest,
            },
            "canonicalization": {
                "algorithm": "json-canonical-sorted-keys-1",
                "encoding": "UTF-8",
                "rejectNonFiniteNumbers": True,
            },
        }
        _latest = record
        return record


def get_current() -> dict[str, Any] | None:
    with _lock:
        return None if _latest is None else dict(_latest)


def clear_current() -> None:
    """Test helper: force UNAVAILABLE. Not exposed as public API."""
    global _latest
    with _lock:
        _latest = None
