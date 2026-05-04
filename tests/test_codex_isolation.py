from __future__ import annotations

import ast
from pathlib import Path

from tests.architecture.policy import CANONICAL_RUNTIME_ROOT, FORBIDDEN_NAMESPACES


def extract_imports(path: Path) -> list[tuple[int, str]]:
    try:
        tree = ast.parse(path.read_text(encoding="utf-8"), filename=path.as_posix())
    except SyntaxError:
        return []
    imports: list[tuple[int, str]] = []

    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                imports.append((node.lineno, alias.name.strip()))
        elif isinstance(node, ast.ImportFrom) and node.module:
            imports.append((node.lineno, node.module.strip()))

    return imports


def _iter_python_files() -> list[Path]:
    root = CANONICAL_RUNTIME_ROOT
    py_files: list[Path] = []
    for base in (root / "backend" / "src" / "codex",):
        if base.exists():
            py_files.extend(base.rglob("*.py"))
    return py_files


def test_codex_modules_do_not_reference_runtime_only_namespaces() -> None:
    root = CANONICAL_RUNTIME_ROOT
    violations: list[tuple[str, int, str]] = []

    for py_file in _iter_python_files():
        rel_path = py_file.resolve().relative_to(root).as_posix()
        for lineno, imported_module in extract_imports(py_file):
            forbidden = next(
                (prefix for prefix in FORBIDDEN_NAMESPACES if imported_module.startswith(prefix)),
                None,
            )
            if forbidden:
                violations.append((rel_path, lineno, imported_module))

    assert not violations, "\n".join(
        f"{file}:{line} imports {imported_module}"
        for file, line, imported_module in sorted(set(violations))
    )
