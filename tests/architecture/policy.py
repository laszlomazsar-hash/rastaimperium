"""Canonical architecture test policy definitions.

This module is the shared source of truth for architecture-level tests so that
runtime-boundary and dependency-injection rules evolve together.
"""

from __future__ import annotations

from pathlib import Path

# Runtime root used by architecture tests when deriving absolute paths.
# Keeping this canonical avoids each test re-defining how to find repository root.
CANONICAL_RUNTIME_ROOT = Path(__file__).resolve().parents[2]

# Codex-layer modules must remain isolated from runtime-only surfaces.
# These prefixes represent namespaces that are forbidden dependencies.
FORBIDDEN_NAMESPACES = (
    "evo_v_core",
    "app.api",
)

# DI policy source of truth:
# Selected endpoint/dependency wiring modules may instantiate engine/controller objects.
# All other modules must consume these objects via dependency injection.
DI_ALLOWLIST_FILES = {
    "app/api/v1/endpoints.py",
    "app/ark_engine/api/dependencies_evo.py",
}

# Optional allowlist entries for legitimate composition roots discovered over time.
DI_OPTIONAL_ALLOWLIST_FILES = {
    "app/core/container.py",
}

# Scan roots for constructor-usage checks.
DI_TARGET_DIRS = (
    Path("app"),
    Path("frontend/app"),
)

# Constructor calls that must only appear in allowlisted DI wiring modules.
FORBIDDEN_DEPENDENCY_EDGES = (
    r"(?<!class\s)\bFieldController\(",
    r"(?<!class\s)\bEvolutionaryOptimizer\(",
    r"(?<!class\s)\bEvolutionaryCulturalOptimizer\(",
    r"(?<!class\s)\bCodexEngine\(",
)
