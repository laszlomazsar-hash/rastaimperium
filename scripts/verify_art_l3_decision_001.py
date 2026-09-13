#!/usr/bin/env python3
"""
Pure offline Python verifier for ART-L3-DECISION-001 (INV-L3-001).

Independent of the Node implementation — does not invoke Node, does not
import application policy, does not use network.

  python3 scripts/verify_art_l3_decision_001.py
  python3 scripts/verify_art_l3_decision_001.py path/to/ART-L3-DECISION-001.json

Exit 0 only when all cases match and observed_digest == sealed expectedDigest.
"""
from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path
from typing import Any


def canonicalize(value: Any) -> str:
    if value is None:
        return "null"
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, (int, float)):
        if isinstance(value, float) and (
            value != value or value in (float("inf"), float("-inf"))
        ):
            raise ValueError("rejectNonFiniteNumbers")
        return json.dumps(value, ensure_ascii=False)
    if isinstance(value, str):
        return json.dumps(value, ensure_ascii=False)
    if isinstance(value, list):
        return "[" + ",".join(canonicalize(v) for v in value) + "]"
    if isinstance(value, dict):
        keys = sorted(value.keys())
        return (
            "{"
            + ",".join(
                json.dumps(k, ensure_ascii=False) + ":" + canonicalize(value[k])
                for k in keys
            )
            + "}"
        )
    raise TypeError(f"unsupported type {type(value)}")


def sha256_hex(s: str) -> str:
    return hashlib.sha256(s.encode("utf-8")).hexdigest()


def evaluate(request: Any, policy_snapshot: dict) -> dict[str, str]:
    if (
        request is None
        or not isinstance(request, dict)
        or not isinstance(request.get("from_state"), str)
        or not isinstance(request.get("event"), str)
        or not isinstance(request.get("to_state"), str)
        or request.get("from_state") == ""
        or request.get("event") == ""
        or request.get("to_state") == ""
    ):
        return {"decision": "DENY", "reason": "INVALID_REQUEST"}

    states = policy_snapshot.get("states") or []
    events = policy_snapshot.get("events") or []
    legal = policy_snapshot.get("legalTransitions") or []

    if request["from_state"] not in states:
        return {"decision": "DENY", "reason": "UNKNOWN_STATE"}
    if request["to_state"] not in states:
        return {"decision": "DENY", "reason": "UNKNOWN_STATE"}
    if request["event"] not in events:
        return {"decision": "DENY", "reason": "UNKNOWN_EVENT"}

    ok = any(
        t.get("from_state") == request["from_state"]
        and t.get("event") == request["event"]
        and t.get("to_state") == request["to_state"]
        for t in legal
    )
    if ok:
        return {"decision": "ALLOW", "reason": "TRANSITION_PERMITTED"}
    return {"decision": "DENY", "reason": "ILLEGAL_TRANSITION"}


def verify(capsule: dict) -> dict:
    if not capsule or capsule.get("artifactId") != "ART-L3-DECISION-001":
        return {"pass": False, "reason": "artifactId mismatch"}
    if capsule.get("invariantId") != "INV-L3-001":
        return {"pass": False, "reason": "invariantId mismatch"}
    if capsule.get("productionAuthority") is not False:
        return {"pass": False, "reason": "productionAuthority must be false"}
    if not capsule.get("policySnapshot") or not isinstance(capsule.get("cases"), list):
        return {"pass": False, "reason": "missing policySnapshot or cases"}
    if not isinstance(capsule.get("expectedDigest"), str):
        return {"pass": False, "reason": "missing expectedDigest"}

    case_ids: set[str] = set()
    results = []
    for c in capsule["cases"]:
        cid = c.get("caseId")
        if not cid or cid in case_ids:
            return {"pass": False, "reason": f"duplicate or missing caseId: {cid}"}
        case_ids.add(cid)
        got = evaluate(c.get("request"), capsule["policySnapshot"])
        exp = c.get("expected") or {}
        if got["decision"] != exp.get("decision") or got["reason"] != exp.get("reason"):
            return {
                "pass": False,
                "reason": (
                    f"case {cid}: expected {exp.get('decision')}/{exp.get('reason')} "
                    f"got {got['decision']}/{got['reason']}"
                ),
            }
        results.append(
            {"caseId": cid, "decision": got["decision"], "reason": got["reason"]}
        )

    observed_result = {
        "schemaVersion": "ri-l3-result-1.0.0",
        "artifactId": "ART-L3-DECISION-001",
        "invariantId": "INV-L3-001",
        "results": results,
    }
    observed_digest = sha256_hex(canonicalize(observed_result))

    if observed_digest != capsule["expectedDigest"]:
        return {
            "pass": False,
            "reason": "digest mismatch",
            "expectedDigest": capsule["expectedDigest"],
            "observedDigest": observed_digest,
        }

    if capsule.get("expectedResult"):
        sealed_digest = sha256_hex(canonicalize(capsule["expectedResult"]))
        if sealed_digest != capsule["expectedDigest"]:
            return {"pass": False, "reason": "expectedResult does not match expectedDigest"}

    return {
        "pass": True,
        "expectedDigest": capsule["expectedDigest"],
        "observedDigest": observed_digest,
        "observedResult": observed_result,
    }


def main() -> int:
    default = (
        Path(__file__).resolve().parents[1]
        / "docs"
        / "evidence"
        / "artifacts"
        / "ART-L3-DECISION-001.json"
    )
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else default
    try:
        capsule = json.loads(path.read_text(encoding="utf-8"))
    except Exception as e:
        print(f"FAIL: cannot read capsule: {e}", file=sys.stderr)
        return 1

    result = verify(capsule)
    print("Artifact:           ART-L3-DECISION-001")
    print("Invariant:          INV-L3-001")
    print("Verifier:           python/verify_art_l3_decision_001.py")
    print("Expected Digest:   ", result.get("expectedDigest") or capsule.get("expectedDigest"))
    print("Observed Digest:   ", result.get("observedDigest") or "(n/a)")
    print("Status:            ", "PASS" if result.get("pass") else "FAIL")
    print("Scope:              Capsule-scoped deterministic L3 decision fixture")
    print("Production Authority: NOT ESTABLISHED (false)")
    print("Limitations:        Not production enforcement; not full EVO-V runtime; not L4/L5/L6/L8")
    if not result.get("pass"):
        print("Reason:", result.get("reason"), file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
