from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path
import sys
import types


def test_observatory_heartbeat_imports_in_canonical_packaging_mode(
    monkeypatch,
) -> None:
    module_path = Path("evo-v/app/api/observatory.py")
    spec = spec_from_file_location("observatory_under_test", module_path)
    assert spec is not None and spec.loader is not None

    app_module = types.ModuleType("app")
    health_module = types.ModuleType("app.health")
    core_module = types.ModuleType("app.core")
    runtime_module = types.ModuleType("app.core.runtime_state")

    health_module.health_state = types.SimpleNamespace(mark_heartbeat=lambda: None)
    runtime_module.get_engine = lambda: types.SimpleNamespace(audit_state=lambda: {})
    runtime_module.runtime_state = types.SimpleNamespace(set_watchdog=lambda _status: None)

    monkeypatch.setitem(sys.modules, "app", app_module)
    monkeypatch.setitem(sys.modules, "app.health", health_module)
    monkeypatch.setitem(sys.modules, "app.core", core_module)
    monkeypatch.setitem(sys.modules, "app.core.runtime_state", runtime_module)

    module = module_from_spec(spec)
    spec.loader.exec_module(module)
    assert callable(module.heartbeat)
