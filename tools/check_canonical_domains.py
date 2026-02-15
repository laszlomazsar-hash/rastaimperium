#!/usr/bin/env python3
"""Fail if docs/reference markdown uses non-canonical Rasta Imperium domains."""

from __future__ import annotations

import re
from pathlib import Path

ALLOWED_DOMAINS = {
    "rastaimperium.com",
    "jah.rastaimperium.com",
    "codex.rastaimperium.com",
    "consulting.rastaimperium.com",
}

BANNED_LITERALS = {
    "jahconsciousness.rastaimperium.com",
    "codexlibrary.rastaimperium.com",
    "<your-railway-domain>",
    "<railway-domain>",
}

HOST_PATTERN = re.compile(r"\b(?:[a-z0-9-]+\.)*rastaimperium\.com\b", re.IGNORECASE)


def iter_target_files() -> list[Path]:
    targets: list[Path] = []
    for root in (Path("."), Path("docs")):
        if root.exists():
            targets.extend(root.glob("*.md"))
    # de-duplicate while preserving order
    seen: set[Path] = set()
    unique: list[Path] = []
    for file_path in targets:
        resolved = file_path.resolve()
        if resolved not in seen:
            seen.add(resolved)
            unique.append(file_path)
    return unique


def main() -> int:
    violations: list[str] = []

    for path in iter_target_files():
        content = path.read_text(encoding="utf-8")

        for banned in BANNED_LITERALS:
            if banned in content:
                violations.append(f"{path}: contains banned literal '{banned}'")

        for match in HOST_PATTERN.finditer(content):
            host = match.group(0).lower()
            if host not in ALLOWED_DOMAINS:
                violations.append(f"{path}: non-canonical domain '{host}'")

    if violations:
        print("Canonical domain check failed:")
        for violation in violations:
            print(f" - {violation}")
        return 1

    print("Canonical domain check passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
