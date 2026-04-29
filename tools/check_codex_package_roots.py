#!/usr/bin/env python3
"""Fail fast when duplicate codex package roots exist."""

from __future__ import annotations

from pathlib import Path
import sys


CANONICAL_ROOT = Path("backend/src/codex")
LEGACY_ROOT = Path("src/codex")
ERROR_MESSAGE = "Duplicate codex roots detected; keep only canonical root."


def main() -> int:
    repo_root = Path.cwd()
    canonical_exists = (repo_root / CANONICAL_ROOT).is_dir()
    legacy_exists = (repo_root / LEGACY_ROOT).is_dir()

    print("Detected codex root candidates:")
    print(f" - {CANONICAL_ROOT}: {'present' if canonical_exists else 'missing'}")
    print(f" - {LEGACY_ROOT}: {'present' if legacy_exists else 'missing'}")

    if canonical_exists and legacy_exists:
        print(f"\nERROR: {ERROR_MESSAGE}", file=sys.stderr)
        print(
            f"Canonical root is {CANONICAL_ROOT}; remove {LEGACY_ROOT} from this commit.",
            file=sys.stderr,
        )
        return 1

    print("Codex package root check passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
