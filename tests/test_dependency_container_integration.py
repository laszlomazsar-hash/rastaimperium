from pathlib import Path

from app.api.dependencies import get_evolutionary_optimizer, get_field_controller
from app.core.container import container_state_payload, get_container


def test_uvicorn_entrypoint_declares_singleton_container_bootstrap() -> None:
    source = Path('app/main.py').read_text()
    assert 'app.state.container = get_container()' in source
    assert 'app_import_path: str = "uvicorn app.main:app"' in Path('app/core/container.py').read_text()


def test_single_engine_instance_shared_across_api_and_observability() -> None:
    container = get_container()
    state = container_state_payload()

    assert get_evolutionary_optimizer() is container.engine
    assert get_field_controller() is container.field_controller
    assert state['engine_id'] == id(container.engine)
    assert state['health_state_id'] == id(container.health_state)
