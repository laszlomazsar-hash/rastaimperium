from __future__ import annotations

import ast
import re
import sys
from pathlib import Path
from typing import Iterable

from tests.architecture.policy import CANONICAL_RUNTIME_ROOT

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
    root = CANONICAL_RUNTIME_ROOT
    for rel in ("backend/src", "src"):
        candidate = root / rel
        if candidate.exists() and str(candidate) not in sys.path:
            sys.path.insert(0, str(candidate))


def _normalize_module_name(module: str) -> str:
    return module.strip()


def extract_imports(path: Path) -> list[tuple[int, str]]:
    tree = ast.parse(path.read_text(encoding="utf-8"), filename=path.as_posix())
    imports: list[tuple[int, str]] = []

    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                imports.append((node.lineno, _normalize_module_name(alias.name)))
        elif isinstance(node, ast.ImportFrom) and node.module:
            imports.append((node.lineno, _normalize_module_name(node.module)))

    return imports


def _module_tokens(module_name: str) -> tuple[str, ...]:
    normalized = module_name.strip().lower()
    return tuple(token for token in re.split(r"[./]", normalized) if token)


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


def _iter_python_files() -> Iterable[Path]:
    root = Path(__file__).resolve().parents[1]
    for base in (root / "backend" / "src", root / "tests"):
        if not base.exists():
            continue
        yield from base.rglob("*.py")


def test_codex_modules_do_not_reference_runtime_only_namespaces() -> None:
    _ensure_codex_search_paths()
    root = Path(__file__).resolve().parents[1]
    violations: list[tuple[str, int, str]] = []

    for py_file in _iter_python_files():
        rel_path = py_file.resolve().relative_to(root).as_posix()
        for lineno, imported_module in extract_imports(py_file):
            forbidden = _violates_policy(imported_module)
            if forbidden:
                violations.append((rel_path, lineno, imported_module))

    assert not violations, "\n".join(
        f"{file}:{line} imports {imported_module}"
        for file, line, imported_module in sorted(set(violations))
    )


def test_import_policy_allows_evo_v_core_runtime_state() -> None:
    assert _violates_policy("evo_v_core.core.runtime_state") is None


def test_import_policy_blocks_evo_v_legacy_namespace() -> None:
    assert _violates_policy("evo_v.some_legacy_module") == "evo_v"
