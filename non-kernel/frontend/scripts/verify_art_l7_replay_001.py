#!/usr/bin/env python3
"""Independent Python reproduction for ART-L7-REPLAY-001.

No website UI. No Node dependency. Same sealed capsule as the JS verifier.
Exit 0 = match sealed expected hashes.
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
            raise ValueError(f"illegal transition {st}->{t}")
        next_state["lifecycle_state"] = t
    elif et == "COMMIT_FINALIZED":
        next_state["commit_finalized"] = True
    else:
        raise ValueError(f"unsupported event_type {et}")
    return next_state


def replay(events, initial):
    state = deepcopy(initial)
    for event in events:
        state = reduce_event(state, event)
    return state


def ledger_head(events):
    head = "GENESIS"
    for event in events:
        head = sha256_hex(f"{head}|{canonicalize(event)}")
    return head


def verify(capsule: dict) -> dict:
    run_a = replay(capsule["events"], capsule["initial_state"])
    run_b = replay(capsule["events"], capsule["initial_state"])
    state_hash_a = sha256_hex(canonicalize(run_a))
    state_hash_b = sha256_hex(canonicalize(run_b))
    head = ledger_head(capsule["events"])
    receipt_payload = {
        "version_bundle": capsule["version_bundle"],
        "event_count": len(capsule["events"]),
        "state_hash": state_hash_a,
        "ledger_head_hash": head,
        "terminal_lifecycle": run_a["lifecycle_state"],
        "commit_finalized": run_a["commit_finalized"],
    }
    receipt_hash = sha256_hex(canonicalize(receipt_payload))
    exp = capsule["expected"]
    checks = {
        "independent_parity": state_hash_a == state_hash_b,
        "state_hash": state_hash_a == exp["state_hash"],
        "ledger_head_hash": head == exp["ledger_head_hash"],
        "receipt_hash": receipt_hash == exp["receipt_hash"],
        "terminal_lifecycle": run_a["lifecycle_state"] == exp["terminal_lifecycle"],
        "commit_finalized": run_a["commit_finalized"] == exp["commit_finalized"],
    }
    return {
        "implementation": "python3",
        "artifactId": capsule["artifactId"],
        "pass": all(checks.values()),
        "checks": checks,
        "computed": {
            "state_hash": state_hash_a,
            "receipt_hash": receipt_hash,
            "ledger_head_hash": head,
        },
        "expected": exp,
    }


def main() -> int:
    default = Path(__file__).resolve().parent.parent / "data/evidence/artifacts/ART-L7-REPLAY-001.json"
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else default
    capsule = json.loads(path.read_text(encoding="utf-8"))
    if capsule.get("artifactId") != "ART-L7-REPLAY-001":
        print(json.dumps({"pass": False, "error": "unexpected artifactId"}))
        return 1
    result = verify(capsule)
    print(json.dumps(result, indent=2))
    return 0 if result["pass"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
