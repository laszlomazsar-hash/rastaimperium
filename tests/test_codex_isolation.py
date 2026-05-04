from __future__ import annotations

import importlib
import pkgutil
import sys
from types import ModuleType
from typing import Iterable

from tests.architecture.policy import CANONICAL_RUNTIME_ROOT, FORBIDDEN_NAMESPACES


def _ensure_codex_search_paths() -> None:
    root = CANONICAL_RUNTIME_ROOT
    for rel in ("backend/src", "src"):
        candidate = root / rel
        if candidate.exists() and str(candidate) not in sys.path:
            sys.path.insert(0, str(candidate))


def _module_origins(module: ModuleType) -> Iterable[str]:
    for value in vars(module).values():
        if isinstance(value, ModuleType):
            origin = value.__name__
        else:
            origin = getattr(value, "__module__", None)

        if isinstance(origin, str) and origin:
            yield origin


def test_codex_modules_do_not_reference_runtime_only_namespaces() -> None:
    _ensure_codex_search_paths()
    importlib.invalidate_caches()
    codex = importlib.import_module("backend.src.codex")

    violations: list[str] = []

    for _, modname, _ in pkgutil.walk_packages(codex.__path__, "backend.src.codex."):
        module = importlib.import_module(modname)

        if any(modname.startswith(prefix) for prefix in FORBIDDEN_NAMESPACES):
            forbidden = next(prefix for prefix in FORBIDDEN_NAMESPACES if modname.startswith(prefix))
            violations.append(f"{modname} depends on {forbidden}")

        for origin in _module_origins(module):
            forbidden = next((prefix for prefix in FORBIDDEN_NAMESPACES if origin.startswith(prefix)), None)
            if forbidden:
                violations.append(f"{modname} depends on {forbidden}")

    assert not violations, "\n".join(sorted(set(violations)))
