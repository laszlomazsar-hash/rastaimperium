"""Compatibility module for legacy ``src.codex.compliance`` import path."""

from backend.src.codex.compliance import *  # noqa: F401,F403
from backend.src.codex.compliance import ComplianceEngine

# Backwards-compatible name used by older call sites.
CodexEngine = ComplianceEngine
