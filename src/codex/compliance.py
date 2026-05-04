"""Compatibility module for legacy ``src.codex.compliance`` import path."""

from backend.src.codex.compliance import (
    PROFILE_SPECS,
    ComplianceEngine,
    ReplayResult,
    ReproducibilityProfile,
)

# Backwards-compatible name used by older call sites.
CodexEngine = ComplianceEngine

__all__ = [
    "CodexEngine",
    "ComplianceEngine",
    "ReplayResult",
    "ReproducibilityProfile",
    "PROFILE_SPECS",
]
