#!/usr/bin/env python3
from __future__ import annotations
import hashlib, json, re, sys
from pathlib import Path
from typing import Any
SCHEMA, PRODUCER, ALLOWED = "ri-ops-event-0.1.0", "ri-ops-runtime-v1", {"OPS_HEARTBEAT"}
DEFAULT = Path(__file__).resolve().parents[3] / "docs/evidence/artifacts/ART-OPS-RUNTIME-REF-001.json"
def canonicalize(value: Any) -> str:
    if value is None: return "null"
    if isinstance(value, bool): return "true" if value else "false"
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        if isinstance(value, float) and (value != value or value in (float("inf"), float("-inf"))): raise ValueError("rejectNonFiniteNumbers")
        return json.dumps(value)
    if isinstance(value, str): return json.dumps(value, ensure_ascii=False)
    if isinstance(value, list): return "[" + ",".join(canonicalize(v) for v in value) + "]"
    if isinstance(value, dict):
        keys = sorted(value.keys())
        return "{" + ",".join(f"{json.dumps(k, ensure_ascii=False)}:{canonicalize(value[k])}" for k in keys) + "}"
    raise TypeError(type(value))
def sha256_hex(s: str) -> str: return hashlib.sha256(s.encode("utf-8")).hexdigest()
def public_payload(record: dict) -> dict:
    return {"schemaVersion": record["schemaVersion"], "artifactId": record.get("artifactId"), "invariantId": record["invariantId"], "eventId": record["eventId"], "producerId": record["producerId"], "producerVersion": record["producerVersion"], "eventType": record["eventType"], "observedAt": record["observedAt"], "sequence": record["sequence"], "scope": record["scope"], "environment": record["environment"], "payload": record["payload"], "limitations": record["limitations"], "productionAuthority": record["productionAuthority"], "status": record["status"]}
def fail(code, detail=None): return {"result": "FAIL", "reason": code, "detail": detail}
def verify_record(record: Any) -> dict:
    if not isinstance(record, dict): return fail("MALFORMED", "record must be object")
    for k in ["schemaVersion","invariantId","eventId","producerId","producerVersion","eventType","observedAt","sequence","scope","environment","payload","limitations","productionAuthority","status","integrity"]:
        if k not in record: return fail("MALFORMED", f"missing {k}")
    if record["schemaVersion"] != SCHEMA: return fail("MALFORMED", "schemaVersion")
    if not isinstance(record["eventId"], str) or not record["eventId"]: return fail("MALFORMED", "eventId")
    if record["producerId"] != PRODUCER: return fail("MALFORMED", "producerId")
    if record["eventType"] not in ALLOWED: return fail("UNKNOWN_EVENT_TYPE", record["eventType"])
    if not isinstance(record["observedAt"], str) or not re.match(r"^\d{4}-\d{2}-\d{2}T", record["observedAt"]): return fail("MALFORMED", "observedAt")
    seq = record["sequence"]
    if not isinstance(seq, (int, float)) or isinstance(seq, bool) or seq != seq or seq < 1: return fail("SEQUENCE_ANOMALY", "sequence")
    if record["productionAuthority"] is not False: return fail("MALFORMED", "productionAuthority must be false")
    integ = record["integrity"]
    if not isinstance(integ, dict) or integ.get("algorithm") != "sha256": return fail("MALFORMED", "integrity")
    digest = integ.get("digest")
    if not isinstance(digest, str) or not re.match(r"^[0-9a-f]{64}$", digest): return fail("MALFORMED", "integrity.digest")
    try: computed = sha256_hex(canonicalize(public_payload(record)))
    except Exception as e: return fail("MALFORMED", str(e))
    if computed != digest: return fail("INTEGRITY_FAILURE", {"expected": digest, "computed": computed})
    return {"result": "PASS", "reason": "INVARIANT_HOLD", "invariantId": "INV-OPS-001", "producerId": record["producerId"], "eventId": record["eventId"], "digest": computed}
def main() -> int:
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT
    try: record = json.loads(path.read_text(encoding="utf-8"))
    except Exception as e:
        print(json.dumps({"result": "FAIL", "reason": "MALFORMED", "detail": str(e)})); return 1
    out = verify_record(record); print(json.dumps(out, indent=2)); return 0 if out["result"] == "PASS" else 1
if __name__ == "__main__": raise SystemExit(main())
