#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from src.codex.compliance import ComplianceEngine, ReplayResult


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Profile-aware replay acceptance check.")
    parser.add_argument("--input", required=True, help="Path to replay metrics JSON file.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
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
