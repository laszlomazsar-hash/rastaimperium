#!/usr/bin/env python3
"""Fail fast when both canonical and legacy codex package roots exist."""

from __future__ import annotations

from pathlib import Path
import sys


CANONICAL_ROOT = Path("backend/src/codex")
LEGACY_ROOT_CANDIDATES = (Path("src/codex"),)


def find_compliance_roots(repo_root: Path) -> set[Path]:
    roots: set[Path] = set()
    for compliance_file in repo_root.glob("**/codex/compliance.py"):
        rel = compliance_file.relative_to(repo_root)
        roots.add(rel.parent)
    return roots


def main() -> int:
    repo_root = Path.cwd()
    compliance_roots = find_compliance_roots(repo_root)

    top_level_canonical = CANONICAL_ROOT in compliance_roots or (repo_root / CANONICAL_ROOT).is_dir()

    legacy_roots: set[Path] = set()
    for root in compliance_roots:
        if root != CANONICAL_ROOT:
            legacy_roots.add(root)
    for candidate in LEGACY_ROOT_CANDIDATES:
        if (repo_root / candidate).is_dir():
            legacy_roots.add(candidate)

    print("Detected codex package roots:")
    for root in sorted(compliance_roots | legacy_roots):
        print(f" - {root}")

    if top_level_canonical and legacy_roots:
        legacy_list = ", ".join(str(path) for path in sorted(legacy_roots))
        print(
            "\nERROR: Found both canonical and legacy codex package roots.",
            file=sys.stderr,
        )
        print(
            f"Canonical root: {CANONICAL_ROOT}; legacy roots: {legacy_list}.",
            file=sys.stderr,
        )
        print(
            "Please keep only backend/src/codex and remove/rename legacy roots.",
            file=sys.stderr,
        )
        return 1

    print("Codex package root check passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
