#!/usr/bin/env python3
"""Enforce a single, committed production web artifact across deployment modes."""

from __future__ import annotations

from pathlib import Path
import sys


ROOT = Path(__file__).resolve().parents[1]
CANONICAL_INDEX = ROOT / "backend/static/index.html"
LEGACY_PUBLIC_INDEX = ROOT / "public/index.html"
DOCKERFILE = ROOT / "Dockerfile"
PAGES_SCRIPT = ROOT / "infra/scripts/deploy-pages.sh"
ASGI_ENTRYPOINT = "src.ark_safety.main:app"


def main() -> int:
    errors: list[str] = []

    if not CANONICAL_INDEX.is_file():
        errors.append("canonical production export is missing: backend/static/index.html")

    if LEGACY_PUBLIC_INDEX.exists():
        legacy = LEGACY_PUBLIC_INDEX.read_text(encoding="utf-8")
        if "Full experience loading" in legacy or "Core restored" in legacy:
            errors.append(
                "public/index.html is a placeholder while backend/static/index.html "
                "is the production export; remove the legacy public root page"
            )
        else:
            errors.append(
                "public/index.html is an unsupported alternate root page; "
                "backend/static/index.html is the only production export"
            )

    dockerfile = DOCKERFILE.read_text(encoding="utf-8")
    if ASGI_ENTRYPOINT not in dockerfile:
        errors.append(f"Dockerfile must start the canonical ASGI entrypoint: {ASGI_ENTRYPOINT}")

    pages_script = PAGES_SCRIPT.read_text(encoding="utf-8")
    if 'STATIC_EXPORT="$REPO_ROOT/backend/static"' not in pages_script:
        errors.append("Pages deployment must source backend/static")
    if 'cp -R "$STATIC_EXPORT/." "$TMP_DIR/"' not in pages_script:
        errors.append("Pages deployment must publish the canonical static export root")

    if errors:
        print("Deployment artifact integrity check failed:", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1

    print("Deployment artifact integrity check passed: Docker and Pages use backend/static/index.html.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
