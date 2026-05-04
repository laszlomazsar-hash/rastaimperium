import importlib
import sys
import types
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
BACKEND_SRC = ROOT / "backend" / "src"
if str(BACKEND_SRC) not in sys.path:
    sys.path.insert(0, str(BACKEND_SRC))


class _DummyOptimizer:
    pass


class _DummyController:
    pass


def _install_runtime_stubs() -> None:
    app_module = types.ModuleType("app")
    ark_engine_module = types.ModuleType("app.ark_engine")
    core_module = types.ModuleType("app.ark_engine.core")
    controller_module = types.ModuleType("app.ark_engine.core.field_controller")
    nextgen_module = types.ModuleType("app.ark_engine.evo_v_nextgen")

    controller_module.IFieldController = _DummyController
    nextgen_module.EvolutionaryCulturalOptimizer = _DummyOptimizer

    sys.modules["app"] = app_module
    sys.modules["app.ark_engine"] = ark_engine_module
    sys.modules["app.ark_engine.core"] = core_module
    sys.modules["app.ark_engine.core.field_controller"] = controller_module
    sys.modules["app.ark_engine.evo_v_nextgen"] = nextgen_module


def test_get_container_is_exposed_from_canonical_runtime_path() -> None:
    _install_runtime_stubs()
    module = importlib.import_module("evo_v_core.runtime.container")

    assert hasattr(module, "get_container")
    assert callable(module.get_container)


def test_get_container_is_reexported_from_evo_v_core_namespace() -> None:
    _install_runtime_stubs()
    module = importlib.import_module("evo_v_core")

    assert hasattr(module, "get_container")
    assert callable(module.get_container)
