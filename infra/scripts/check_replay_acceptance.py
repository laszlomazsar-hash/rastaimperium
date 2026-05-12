#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_SRC = REPO_ROOT / "backend" / "src"
for entry in (BACKEND_SRC, REPO_ROOT):
    entry_str = str(entry)
    if entry_str not in sys.path:
        sys.path.insert(0, entry_str)

from codex.compliance import ComplianceEngine, ReplayResult
from src.governance.runtime import load_runtime_policy


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Profile-aware replay acceptance check.")
    parser.add_argument("--input", required=True, help="Path to replay metrics JSON file.")
    parser.add_argument(
        "--governance-manifest",
        default="config/governance_manifest.json",
        help="Path to executable governance manifest.",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    runtime_policy = load_runtime_policy(REPO_ROOT / args.governance_manifest)
    runtime_policy.guards.validate_event_type("COMMIT_FINALIZED")
    runtime_policy.guards.validate_version_bundle(
        {
            "schema_version": runtime_policy.schema_version,
            "ruleset_version": runtime_policy.ruleset_version,
            "governance_version": runtime_policy.governance_version,
            "canon_spec_version": "1.0",
        }
    )

    payload = json.loads(Path(args.input).read_text())

    engine = ComplianceEngine()
    result = engine.evaluate_replay_acceptance(
        ReplayResult(
            hash_match=bool(payload["hash_match"]),
            max_abs_error=float(payload["max_abs_error"]),
            p_value=float(payload["p_value"]),
        )
    )
    print(json.dumps(result, indent=2, sort_keys=True))
    return 0 if result["accepted"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
