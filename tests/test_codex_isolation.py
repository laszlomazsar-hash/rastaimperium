from __future__ import annotations

import importlib
import pkgutil
import re
import sys
from pathlib import Path
from types import ModuleType
from typing import Iterable

POLICY_NAMESPACES = {
    "forbidden": (
        "evo_v",
        "evo-v",
        "app.api",
    ),
    "allowed": (
        "evo_v_core",
    ),
}


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


def _module_tokens(module_name: str) -> tuple[str, ...]:
    normalized = module_name.strip().lower()
    tokens = tuple(token for token in re.split(r"[./]", normalized) if token)
    return tokens


def _matches_namespace(module_name: str, namespace: str) -> bool:
    module_tokens = _module_tokens(module_name)
    namespace_tokens = _module_tokens(namespace)
    if len(module_tokens) < len(namespace_tokens):
        return False
    return module_tokens[: len(namespace_tokens)] == namespace_tokens


def _violates_policy(module_name: str) -> str | None:
    if any(_matches_namespace(module_name, allowed) for allowed in POLICY_NAMESPACES["allowed"]):
        return None

    return next(
        (
            forbidden
            for forbidden in POLICY_NAMESPACES["forbidden"]
            if _matches_namespace(module_name, forbidden)
        ),
        None,
    )


def test_codex_modules_do_not_reference_runtime_only_namespaces() -> None:
    _ensure_codex_search_paths()
    importlib.invalidate_caches()
    codex = importlib.import_module("backend.src.codex")

    violations: list[str] = []

    for _, modname, _ in pkgutil.walk_packages(codex.__path__, "backend.src.codex."):
        module = importlib.import_module(modname)

        forbidden = _violates_policy(modname)
        if forbidden:
            violations.append(f"{modname} depends on {forbidden}")

        for origin in _module_origins(module):
            forbidden = _violates_policy(origin)
            if forbidden:
                violations.append(f"{modname} depends on {forbidden}")

    assert not violations, "\n".join(sorted(set(violations)))


def test_import_policy_allows_evo_v_core_runtime_state() -> None:
    assert _violates_policy("evo_v_core.core.runtime_state") is None


def test_import_policy_blocks_evo_v_legacy_namespace() -> None:
    assert _violates_policy("evo_v.some_legacy_module") == "evo_v"
