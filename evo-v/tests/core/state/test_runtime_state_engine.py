import importlib
import sys
import types
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3] / "app"))


if "state" not in sys.modules:
    state_module = types.ModuleType("state")

    class EngineState:
        def transition(self, agent_name: str, status: str) -> None:
            return None

        def mark_failure(self, agent_name: str, error: str) -> None:
            return None

        def mark_heartbeat(self, active_sandboxes: int) -> None:
            return None

        def read_snapshot(self) -> dict:
            return {"state": "idle", "events": []}

    state_module.EngineState = EngineState
    sys.modules["state"] = state_module


def test_runtime_engine_singleton_is_initialized_and_shared() -> None:
    runtime_state_module = importlib.import_module("core.runtime_state")
    shared_engine = runtime_state_module.engine

    assert shared_engine is not None

    provisioning_module = importlib.import_module("api.provisioning")
    engine_from_provisioning = provisioning_module.engine

    assert engine_from_provisioning is shared_engine
    assert importlib.import_module("core.runtime_state").engine is shared_engine
