from core import engine_runtime
from core.runtime_state import get_engine


def test_engine_runtime_get_engine_matches_runtime_state_singleton() -> None:
    assert engine_runtime.get_engine() is get_engine()


def test_engine_runtime_engine_attribute_matches_runtime_state_singleton() -> None:
    assert engine_runtime.engine is get_engine()
