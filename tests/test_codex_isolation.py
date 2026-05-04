from __future__ import annotations

import importlib
import pkgutil
import sys
from pathlib import Path
from types import ModuleType
from typing import Iterable

FORBIDDEN_PREFIXES = (
    "evo_v_core",
    "app.api",
)


def _ensure_codex_search_paths() -> None:
    root = Path(__file__).resolve().parents[1]
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

        if any(modname.startswith(prefix) for prefix in FORBIDDEN_PREFIXES):
            forbidden = next(prefix for prefix in FORBIDDEN_PREFIXES if modname.startswith(prefix))
            violations.append(f"{modname} depends on {forbidden}")

        for origin in _module_origins(module):
            forbidden = next((prefix for prefix in FORBIDDEN_PREFIXES if origin.startswith(prefix)), None)
            if forbidden:
                violations.append(f"{modname} depends on {forbidden}")

    assert not violations, "\n".join(sorted(set(violations)))
