from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class CompatibilityResult:
    compatible: bool
    reason: str | None = None


def _major(version: str) -> int | None:
    parts = version.split(".")
    if len(parts) != 3 or not all(part.isdigit() for part in parts):
        return None
    return int(parts[0])


def validate_required_keys(payload: dict[str, object], required_keys: set[str]) -> CompatibilityResult:
    missing = required_keys - set(payload.keys())
    if missing:
        return CompatibilityResult(compatible=False, reason=f"missing required keys: {sorted(missing)}")
    return CompatibilityResult(compatible=True)


def validate_schema_compatibility(payload: dict[str, object], supported_major: int) -> CompatibilityResult:
    schema_version = payload.get("schema_version")
    if not isinstance(schema_version, str):
        return CompatibilityResult(compatible=False, reason="schema_version must be a string")

    payload_major = _major(schema_version)
    if payload_major is None:
        return CompatibilityResult(compatible=False, reason="schema_version must follow semver")

    if payload_major != supported_major:
        return CompatibilityResult(
            compatible=False,
            reason=f"unsupported schema major: {payload_major}; expected {supported_major}",
        )

    return CompatibilityResult(compatible=True)
