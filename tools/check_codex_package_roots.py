#!/usr/bin/env python3
"""Fail fast when duplicate codex package roots exist."""

from __future__ import annotations

from pathlib import Path
import sys


CANONICAL_ROOT = Path("backend/src/codex")
LEGACY_ROOT = Path("src/codex")
ERROR_MESSAGE = "Duplicate codex roots detected; keep only canonical root."


def detect_roots(repo_root: Path) -> tuple[bool, bool]:
    """Return explicit root existence booleans for canonical and legacy roots."""
    canonical_exists = (repo_root / CANONICAL_ROOT).is_dir()
    legacy_exists = (repo_root / LEGACY_ROOT).is_dir()
    return canonical_exists, legacy_exists


def print_topology_diagnostics(canonical_exists: bool, legacy_exists: bool) -> None:
    """Print deterministic topology diagnostics separately from enforcement."""
    print("Detected codex root candidates:")
    print(f" - {CANONICAL_ROOT}: {'present' if canonical_exists else 'missing'}")
    print(f" - {LEGACY_ROOT}: {'present' if legacy_exists else 'missing'}")


def main() -> int:
    repo_root = Path.cwd()
    canonical_exists, legacy_exists = detect_roots(repo_root)
    root_count = int(canonical_exists) + int(legacy_exists)

    print_topology_diagnostics(canonical_exists, legacy_exists)

    if root_count == 2:
        print(f"\nERROR: {ERROR_MESSAGE}", file=sys.stderr)
        print(
            "Detected roots: "
            f"{CANONICAL_ROOT}={canonical_exists}, {LEGACY_ROOT}={legacy_exists}",
            file=sys.stderr,
        )
        print(
            f"Canonical root is {CANONICAL_ROOT}; remove {LEGACY_ROOT} from this commit.",
            file=sys.stderr,
        )
        return 1

    print("Codex package root check passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
