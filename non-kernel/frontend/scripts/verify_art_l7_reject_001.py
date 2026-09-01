#!/usr/bin/env python3
"""Independent Python reproduction for ART-L7-REJECT-001.

No website UI. No Node dependency.
Exit 0 = rejection path matches sealed receipt.
"""
from __future__ import annotations

import hashlib
import json
import sys
from copy import deepcopy
from pathlib import Path

ALLOWED = {
    "INGESTED": {"NORMALIZED"},
    "NORMALIZED": {"VERIFIED"},
    "VERIFIED": {"CORRELATED"},
    "CORRELATED": {"ARCHIVED"},
    "ARCHIVED": set(),
    "CONTESTED": set(),
}


def canonicalize(value) -> str:
    if value is None or not isinstance(value, (dict, list)):
        return json.dumps(value, separators=(",", ":"), ensure_ascii=False)
    if isinstance(value, list):
        return "[" + ",".join(canonicalize(v) for v in value) + "]"
    keys = sorted(value.keys())
    return "{" + ",".join(json.dumps(k, ensure_ascii=False) + ":" + canonicalize(value[k]) for k in keys) + "}"


def sha256_hex(s: str) -> str:
    return hashlib.sha256(s.encode("utf-8")).hexdigest()


def reduce_event(state: dict, event: dict) -> dict:
    next_state = {
        "lifecycle_state": state["lifecycle_state"],
        "records": dict(state["records"]),
        "commit_finalized": state["commit_finalized"],
    }
    et = event["event_type"]
    if et == "RECORD_INSERT":
        rid = event["record_id"]
        if rid in next_state["records"]:
            raise ValueError("duplicate record_id")
        next_state["records"][rid] = event["payload"]
    elif et == "STATE_TRANSITION":
        st = next_state["lifecycle_state"]
        t = event["to_state"]
        if not (t == "CONTESTED" or t in ALLOWED.get(st, set())):
            err = ValueError(f"illegal transition {st}->{t}")
            err.code = "ILLEGAL_TRANSITION"  # type: ignore[attr-defined]
            err.from_state = st  # type: ignore[attr-defined]
            err.to_state = t  # type: ignore[attr-defined]
            raise err
        next_state["lifecycle_state"] = t
    elif et == "COMMIT_FINALIZED":
        next_state["commit_finalized"] = True
    else:
        raise ValueError(f"unsupported event_type {et}")
    return next_state


def run(capsule: dict) -> dict:
    state = deepcopy(capsule["initial_state"])
    rejection = None
    index = 0
    for event in capsule["events"]:
        try:
            state = reduce_event(state, event)
            index += 1
        except ValueError as e:
            rejection = {
                "rejected": True,
                "rejection_index": index,
                "rejection_code": getattr(e, "code", "REJECT"),
                "rejection_message": str(e),
                "from_state": getattr(e, "from_state", None),
                "to_state": getattr(e, "to_state", None),
                "state_before_reject": state,
            }
            break
    if rejection is None:
        return {"pass": False, "reason": "expected rejection did not occur"}

    state_before_hash = sha256_hex(canonicalize(rejection["state_before_reject"]))
    head = "GENESIS"
    for event in capsule["events"]:
        head = sha256_hex(f"{head}|{canonicalize(event)}")
    receipt_payload = {
        "version_bundle": capsule["version_bundle"],
        "event_count": len(capsule["events"]),
        "rejection_index": rejection["rejection_index"],
        "rejection_code": rejection["rejection_code"],
        "rejection_message": rejection["rejection_message"],
        "from_state": rejection["from_state"],
        "to_state": rejection["to_state"],
        "state_before_hash": state_before_hash,
        "attempted_ledger_head": head,
        "state_mutated": False,
    }
    receipt_hash = sha256_hex(canonicalize(receipt_payload))
    exp = capsule["expected"]
    checks = {
        "rejected": rejection["rejected"] is True and exp["rejected"] is True,
        "rejection_index": rejection["rejection_index"] == exp["rejection_index"],
        "rejection_code": rejection["rejection_code"] == exp["rejection_code"],
        "rejection_message": rejection["rejection_message"] == exp["rejection_message"],
        "from_state": rejection["from_state"] == exp["from_state"],
        "to_state": rejection["to_state"] == exp["to_state"],
        "state_before_hash": state_before_hash == exp["state_before_hash"],
        "attempted_ledger_head": head == exp["attempted_ledger_head"],
        "receipt_hash": receipt_hash == exp["receipt_hash"],
        "state_mutated": exp["state_mutated"] is False,
    }
    return {
        "implementation": "python3",
        "artifactId": capsule["artifactId"],
        "pass": all(checks.values()),
        "checks": checks,
        "computed": {
            "state_before_hash": state_before_hash,
            "attempted_ledger_head": head,
            "receipt_hash": receipt_hash,
            "rejection_code": rejection["rejection_code"],
            "rejection_message": rejection["rejection_message"],
        },
        "expected": exp,
    }


def main() -> int:
    default = Path(__file__).resolve().parent.parent / "data/evidence/artifacts/ART-L7-REJECT-001.json"
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else default
    capsule = json.loads(path.read_text(encoding="utf-8"))
    if capsule.get("artifactId") != "ART-L7-REJECT-001":
        print(json.dumps({"pass": False, "error": "unexpected artifactId"}))
        return 1
    result = run(capsule)
    print(json.dumps(result, indent=2))
    return 0 if result.get("pass") else 1


if __name__ == "__main__":
    raise SystemExit(main())
