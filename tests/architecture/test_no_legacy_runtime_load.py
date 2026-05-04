from __future__ import annotations

import ast
from pathlib import Path

ACTIVE_CODE_ROOTS = (
    Path("backend/src"),
    Path("tests"),
)

# Legacy runtime namespaces that must not be imported by active code.
FORBIDDEN_NAMESPACE_PREFIXES = (
    "evo_v",
    "evo_v_core",
)

# Explicitly allowlist migration-only tooling locations if they ever need to
# bridge to legacy modules during migration windows.
MIGRATION_IMPORT_ALLOWLIST: set[str] = set()


def _iter_python_files(roots: tuple[Path, ...] = ACTIVE_CODE_ROOTS) -> list[Path]:
    files: list[Path] = []
    for root in roots:
        if not root.exists():
            continue
        files.extend(path for path in root.rglob("*.py"))
    return files


def _normalize_namespace(value: str) -> str:
    return value.replace("-", "_")


def _is_forbidden_namespace(value: str) -> bool:
    normalized = _normalize_namespace(value)
    return any(
        normalized == prefix or normalized.startswith(f"{prefix}.")
        for prefix in FORBIDDEN_NAMESPACE_PREFIXES
    )


def _collect_legacy_import_violations(roots: tuple[Path, ...] = ACTIVE_CODE_ROOTS) -> list[str]:
    violations: list[str] = []

    for py_file in _iter_python_files(roots):
        relative = py_file.as_posix()
        if relative in MIGRATION_IMPORT_ALLOWLIST:
            continue

        tree = ast.parse(py_file.read_text(encoding="utf-8"), filename=relative)
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for alias in node.names:
                    if _is_forbidden_namespace(alias.name):
                        violations.append(
                            f"{relative}:{node.lineno} imports forbidden namespace '{alias.name}'"
                        )
            elif isinstance(node, ast.ImportFrom) and node.module:
                if _is_forbidden_namespace(node.module):
                    violations.append(
                        f"{relative}:{node.lineno} imports forbidden namespace '{node.module}'"
                    )

    return violations


def test_no_active_code_imports_legacy_runtime_namespaces() -> None:
    violations = _collect_legacy_import_violations()

    assert violations == [], "\n".join((
        "Active code imports legacy runtime namespaces.",
        "Remove these imports or move truly transitional migration code to MIGRATION_IMPORT_ALLOWLIST:",
        *sorted(violations),
    ))


def test_legacy_import_scanner_negative_fixture(tmp_path: Path) -> None:
    backend_root = tmp_path / "backend" / "src"
    forbidden_file = backend_root / "sample_module.py"
    forbidden_file.parent.mkdir(parents=True, exist_ok=True)
    forbidden_file.write_text("import evo_v.runtime\n", encoding="utf-8")

    violations = _collect_legacy_import_violations(roots=(backend_root,))

    assert violations == [
        f"{forbidden_file.as_posix()}:1 imports forbidden namespace 'evo_v.runtime'"
    ]
