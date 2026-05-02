#!/usr/bin/env python3
"""Validate architecture version consistency across canonical and derivative artifacts."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

CANONICAL_DOC = Path("docs/ARCHITECTURE_CANONICAL.md")
BLUEPRINT_JSON = Path("config/blueprint-v3.5.json")


def extract_canonical_version(markdown_text: str) -> str:
    match = re.search(r"Canonical architecture version:\s*`([^`]+)`", markdown_text)
    if not match:
        raise ValueError(
            "Could not find canonical architecture version in docs/ARCHITECTURE_CANONICAL.md"
        )
    return match.group(1).strip()


def validate_versions(canonical_version: str, blueprint: dict, expected_source: str) -> list[str]:
    metadata = blueprint.get("metadata", {})
    metadata_version = metadata.get("architectureVersion")
    source_of_truth = metadata.get("sourceOfTruth")
    blueprint_version = blueprint.get("version")

    errors: list[str] = []

    if not metadata_version:
        errors.append("Missing config/blueprint-v3.5.json metadata.architectureVersion")
    elif metadata_version != canonical_version:
        errors.append(
            "Version mismatch: "
            f"canonical={canonical_version} blueprint.metadata.architectureVersion={metadata_version}"
        )

    if not blueprint_version:
        errors.append("Missing config/blueprint-v3.5.json version")
    elif blueprint_version != canonical_version:
        errors.append(
            "Version mismatch: "
            f"canonical={canonical_version} blueprint.version={blueprint_version}"
        )

    if source_of_truth != expected_source:
        errors.append(
            "Source-of-truth mismatch: "
            f"expected metadata.sourceOfTruth={expected_source}, got {source_of_truth}"
        )

    return errors


def main() -> int:
    canonical_text = CANONICAL_DOC.read_text(encoding="utf-8")
    canonical_version = extract_canonical_version(canonical_text)

    blueprint = json.loads(BLUEPRINT_JSON.read_text(encoding="utf-8"))
    expected_source = str(CANONICAL_DOC)
    errors = validate_versions(canonical_version, blueprint, expected_source)

    if errors:
        for error in errors:
            print(f"ERROR: {error}")
        return 1

    print(
        "Architecture version validation passed: "
        f"version={canonical_version}, source={expected_source}"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
