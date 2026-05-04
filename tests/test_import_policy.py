from __future__ import annotations

import ast
from pathlib import Path

BACKEND_SRC_ROOT = Path("backend/src")

# (source_prefix, forbidden_dependency_prefix)
# codex remains a pure math/safety kernel and must not import web runtime layers.
# workspaces is a domain service layer and should not couple to payment integrations.
# payment adapters must stay narrowly focused and avoid pulling in admin tooling.
FORBIDDEN_EDGES: tuple[tuple[str, str], ...] = (
    ("codex", "app."),
    ("codex", "admin."),
    ("workspaces", "payment."),
    ("payment", "admin."),
)


def _iter_python_files(root: Path) -> list[Path]:
    if not root.exists():
        return []
    return sorted(path for path in root.rglob("*.py") if path.name != "__init__.py")


def _module_name_from_path(path: Path, root: Path) -> str:
    relative = path.relative_to(root)
    return ".".join(relative.with_suffix("").parts)


def _collect_imported_modules(tree: ast.AST) -> list[tuple[str, int]]:
    imported: list[tuple[str, int]] = []

    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                imported.append((alias.name, node.lineno))
        elif isinstance(node, ast.ImportFrom):
            if node.module:
                imported.append((node.module, node.lineno))

    return imported


def _find_forbidden_import_edges(root: Path) -> list[str]:
    violations: list[str] = []

    for py_file in _iter_python_files(root):
        module = _module_name_from_path(py_file, root)
        tree = ast.parse(py_file.read_text(encoding="utf-8"), filename=py_file.as_posix())

        for imported, lineno in _collect_imported_modules(tree):
            for src_prefix, dst_prefix in FORBIDDEN_EDGES:
                if module.startswith(src_prefix) and imported.startswith(dst_prefix):
                    violations.append(
                        f"{py_file.as_posix()}:{lineno} ({module}) imports {imported} "
                        f"forbidden by edge {src_prefix} -> {dst_prefix}"
                    )

    return sorted(set(violations))


def test_backend_import_policy() -> None:
    violations = _find_forbidden_import_edges(BACKEND_SRC_ROOT)
    assert violations == [], "\n" + "\n".join(violations)
