from __future__ import annotations

import importlib.abc
import os
import sys
from types import ModuleType

_LEGACY_PREFIXES = ("evo_v", "evo-v")
_TOOL_ENV_FLAG = "RASTA_TOOLING_ALLOW_LEGACY_IMPORTS"


class LegacyNamespaceImportError(ImportError):
    """Raised when runtime code attempts to import blocked legacy namespaces."""


class _LegacyNamespaceFinder(importlib.abc.MetaPathFinder):
    def find_spec(self, fullname: str, path: object | None, target: ModuleType | None = None) -> None:
        if _is_blocked(fullname):
            raise LegacyNamespaceImportError(_error_message(fullname))
        return None


def _is_blocked(module_name: str) -> bool:
    if os.getenv(_TOOL_ENV_FLAG) == "1":
        return False

    return any(module_name == prefix or module_name.startswith(f"{prefix}.") for prefix in _LEGACY_PREFIXES)


def _error_message(module_name: str) -> str:
    return (
        f"Legacy namespace import blocked at runtime: '{module_name}'. "
        "Imports under the legacy evo-v namespace are runtime-fatal. "
        f"Tooling/migration-only override: set {_TOOL_ENV_FLAG}=1."
    )


def install_legacy_import_guard() -> None:
    if any(isinstance(finder, _LegacyNamespaceFinder) for finder in sys.meta_path):
        return
    sys.meta_path.insert(0, _LegacyNamespaceFinder())
