"""Compatibility module for legacy ``src.codex.compliance`` import path."""

from backend.src.codex.compliance import (
    PROFILE_SPECS,
    ComplianceEngine,
    ReplayResult,
    ReproducibilityProfile,
)

<<<<<<< codex/identify-root-causes-of-github-actions-failures-avqlfm
# Backwards-compatible alias used by older call sites.
=======
# Backwards-compatible name used by older call sites.
>>>>>>> main
CodexEngine = ComplianceEngine

__all__ = [
    "CodexEngine",
    "ComplianceEngine",
    "ReplayResult",
    "ReproducibilityProfile",
    "PROFILE_SPECS",
]
