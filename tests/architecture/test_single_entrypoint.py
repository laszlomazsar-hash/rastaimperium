from __future__ import annotations

import ast
from dataclasses import dataclass
from pathlib import Path

BACKEND_SRC = Path("backend/src")
ALLOWED_APP_INSTANCE = ("ark_safety.main", "app")
ALLOWED_APP_FACTORY: tuple[str, str] | None = None


@dataclass(frozen=True)
class AppAssignment:
    module: str
    symbol: str
    line: int


@dataclass(frozen=True)
class FactoryExport:
    module: str
    symbol: str
    line: int


def _iter_python_files(root: Path) -> list[Path]:
    if not root.exists():
        return []
    return sorted(path for path in root.rglob("*.py") if path.is_file())


def _module_from_path(path: Path, root: Path) -> str:
    return ".".join(path.relative_to(root).with_suffix("").parts)


def _is_fastapi_call(node: ast.AST) -> bool:
    if not isinstance(node, ast.Call):
        return False

    func = node.func
    if isinstance(func, ast.Name):
        return func.id == "FastAPI"
    if isinstance(func, ast.Attribute):
        return func.attr == "FastAPI"
    return False


def _extract_names(target: ast.AST) -> list[str]:
    if isinstance(target, ast.Name):
        return [target.id]
    if isinstance(target, (ast.Tuple, ast.List)):
        names: list[str] = []
        for element in target.elts:
            names.extend(_extract_names(element))
        return names
    return []


def _discover_app_assignments(root: Path) -> list[AppAssignment]:
    assignments: list[AppAssignment] = []

    for py_file in _iter_python_files(root):
        module = _module_from_path(py_file, root)
        tree = ast.parse(py_file.read_text(encoding="utf-8"), filename=py_file.as_posix())

        for node in ast.walk(tree):
            if not isinstance(node, ast.Assign) or not _is_fastapi_call(node.value):
                continue
            for target in node.targets:
                for symbol in _extract_names(target):
                    assignments.append(AppAssignment(module=module, symbol=symbol, line=node.lineno))

    return assignments


def _discover_factory_exports(root: Path, allowed_factory: tuple[str, str] | None) -> list[FactoryExport]:
    if allowed_factory is None:
        return []

    factory_module, factory_name = allowed_factory
    exports: list[FactoryExport] = []

    for py_file in _iter_python_files(root):
        module = _module_from_path(py_file, root)
        if module != factory_module:
            continue

        tree = ast.parse(py_file.read_text(encoding="utf-8"), filename=py_file.as_posix())
        for node in tree.body:
            if not isinstance(node, ast.Assign):
                continue
            if not isinstance(node.value, ast.Call):
                continue
            if not isinstance(node.value.func, ast.Name):
                continue
            if node.value.func.id != factory_name:
                continue
            for target in node.targets:
                for symbol in _extract_names(target):
                    exports.append(FactoryExport(module=module, symbol=symbol, line=node.lineno))

    return exports


def test_fastapi_has_single_canonical_entrypoint() -> None:
    app_instances = _discover_app_assignments(BACKEND_SRC)
    found_locations = {(entry.module, entry.symbol) for entry in app_instances}

    assert found_locations == {ALLOWED_APP_INSTANCE}, (
        "FastAPI app instances must be defined exactly once at the canonical location. "
        f"Expected: {ALLOWED_APP_INSTANCE}; found: "
        + ", ".join(
            f"{entry.module}.{entry.symbol}:L{entry.line}" for entry in sorted(app_instances, key=lambda e: (e.module, e.symbol, e.line))
        )
    )


def test_factory_exports_single_app_object_when_factory_is_enabled() -> None:
    exports = _discover_factory_exports(BACKEND_SRC, ALLOWED_APP_FACTORY)

    if ALLOWED_APP_FACTORY is None:
        assert exports == []
        return

    assert len(exports) == 1, (
        "Factory mode requires exactly one exported app object created by the allowlisted factory. "
        f"Factory: {ALLOWED_APP_FACTORY}; found exports: "
        + ", ".join(f"{entry.module}.{entry.symbol}:L{entry.line}" for entry in exports)
    )
