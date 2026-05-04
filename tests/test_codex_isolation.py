from __future__ import annotations

import ast
from pathlib import Path
from typing import Iterable

FORBIDDEN_PREFIXES = (
    "evo_v_core",
    "app.api",
)


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


def _iter_python_files() -> Iterable[Path]:
    root = Path(__file__).resolve().parents[1]
    for base in (root / "backend" / "src", root / "tests"):
        if not base.exists():
            continue
        yield from base.rglob("*.py")


def test_codex_modules_do_not_reference_runtime_only_namespaces() -> None:
    root = Path(__file__).resolve().parents[1]
    violations: list[tuple[str, int, str]] = []

    for py_file in _iter_python_files():
        rel_path = py_file.resolve().relative_to(root).as_posix()
        for lineno, imported_module in extract_imports(py_file):
            forbidden = next(
                (prefix for prefix in FORBIDDEN_PREFIXES if imported_module.startswith(prefix)),
                None,
            )
            if forbidden:
                violations.append((rel_path, lineno, imported_module))

    assert not violations, "\n".join(
        f"{file}:{line} imports {imported_module}"
        for file, line, imported_module in sorted(set(violations))
    )
