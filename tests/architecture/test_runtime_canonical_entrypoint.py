from __future__ import annotations

import ast
import importlib.util
import sys
import types
from pathlib import Path

import pytest
from fastapi import APIRouter

RUNTIME_ROOT = Path("evo-v-core/app")
CANONICAL_MAIN_MODULE = RUNTIME_ROOT / "main.py"
ALLOWED_APP_ENTRYPOINTS = {"main.py"}
BOOTSTRAP_CALL = "initialize_runtime"


def _load_module_from_path(module_path: Path, module_name: str):
    sys.path.insert(0, str(module_path.parent))
    spec = importlib.util.spec_from_file_location(module_name, module_path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Unable to load module from {module_path}")
    module = importlib.util.module_from_spec(spec)
    try:
        spec.loader.exec_module(module)
    except NameError:
        # main.py may fail after app construction if non-canonical symbols are referenced.
        pass
    finally:
        sys.path.pop(0)
    return module


def _module_exports_app(module_path: Path) -> bool:
    tree = ast.parse(module_path.read_text(encoding="utf-8"))
    for node in tree.body:
        if isinstance(node, ast.Assign):
            for target in node.targets:
                if isinstance(target, ast.Name) and target.id == "app":
                    return True
        if isinstance(node, ast.AnnAssign) and isinstance(node.target, ast.Name):
            if node.target.id == "app":
                return True
    return False


def _discover_app_entrypoints(runtime_root: Path) -> list[Path]:
    return sorted(
        path.relative_to(runtime_root)
        for path in runtime_root.glob("*.py")
        if path.name != "__init__.py" and _module_exports_app(path)
    )


def _module_bootstrap_references(module_path: Path, bootstrap_name: str) -> set[str]:
    tree = ast.parse(module_path.read_text(encoding="utf-8"))
    references: set[str] = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Call) and isinstance(node.func, ast.Name):
            if node.func.id == bootstrap_name:
                references.add(bootstrap_name)
        elif isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute):
            if node.func.attr == bootstrap_name:
                references.add(bootstrap_name)
        if isinstance(node, ast.ImportFrom):
            for alias in node.names:
                if alias.name == bootstrap_name:
                    references.add(bootstrap_name)
    return references


def test_canonical_runtime_main_exports_app(monkeypatch: pytest.MonkeyPatch) -> None:
    api_module = types.ModuleType("api")
    api_module.epistemic = types.SimpleNamespace(router=APIRouter())
    api_module.observatory = types.SimpleNamespace(router=APIRouter())
    api_module.provisioning = types.SimpleNamespace(router=APIRouter())

    monkeypatch.setitem(sys.modules, "api", api_module)
    monkeypatch.setitem(sys.modules, "epistemic", types.SimpleNamespace(router=APIRouter()))
    monkeypatch.setitem(sys.modules, "health", types.SimpleNamespace(health_router=APIRouter()))
    monkeypatch.setitem(sys.modules, "watchdog", types.SimpleNamespace(start_watchdog=lambda _app: None))
    monkeypatch.setitem(
        sys.modules,
        "core.runtime_state",
        types.SimpleNamespace(initialize_runtime=lambda: None),
    )
    monkeypatch.setitem(sys.modules, "codex", types.SimpleNamespace(router=APIRouter()))

    main_module = _load_module_from_path(CANONICAL_MAIN_MODULE, "evo_v_core_main")

    assert hasattr(main_module, "app"), "Canonical runtime main must export 'app'."


def test_no_parallel_runtime_entrypoints_exist() -> None:
    discovered = _discover_app_entrypoints(RUNTIME_ROOT)

    assert {path.as_posix() for path in discovered} == ALLOWED_APP_ENTRYPOINTS, (
        "Only the canonical runtime module may export an app entrypoint. "
        f"Found: {[path.as_posix() for path in discovered]}"
    )


def test_api_and_worker_cli_boot_paths_share_bootstrap() -> None:
    api_boot = _module_bootstrap_references(RUNTIME_ROOT / "main.py", BOOTSTRAP_CALL)
    worker_cli_boot = _module_bootstrap_references(
        RUNTIME_ROOT / "core" / "engine_runtime.py", BOOTSTRAP_CALL
    )

    assert BOOTSTRAP_CALL in api_boot
    assert BOOTSTRAP_CALL in worker_cli_boot


def test_hidden_secondary_runtime_graph_fixture_is_rejected(tmp_path: Path) -> None:
    fixture_runtime = tmp_path / "runtime"
    fixture_runtime.mkdir()

    (fixture_runtime / "main.py").write_text(
        "from fastapi import FastAPI\napp = FastAPI()\n", encoding="utf-8"
    )
    (fixture_runtime / "_shadow_runtime.py").write_text(
        "from fastapi import FastAPI\napp = FastAPI()\n", encoding="utf-8"
    )

    discovered = _discover_app_entrypoints(fixture_runtime)

    assert {path.as_posix() for path in discovered} == {"main.py", "_shadow_runtime.py"}
    assert {path.as_posix() for path in discovered} != ALLOWED_APP_ENTRYPOINTS
