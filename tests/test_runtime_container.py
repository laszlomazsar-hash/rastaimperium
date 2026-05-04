from app.core.container import AppContainer, get_container
from app.ark_engine.core.field_controller import IFieldController
from app.ark_engine.evo_v_nextgen import EvolutionaryCulturalOptimizer


def test_get_container_exists() -> None:
    container = get_container()
    assert isinstance(container, AppContainer)


def test_get_container_singleton_identity() -> None:
    assert get_container() is get_container()


def test_runtime_services_are_container_owned() -> None:
    container = get_container()
    assert container.evolutionary_optimizer is get_container().evolutionary_optimizer
    assert container.field_controller is get_container().field_controller


def test_direct_runtime_object_creation_outside_container_rejected() -> None:
    try:
        EvolutionaryCulturalOptimizer()
        raise AssertionError("Expected direct optimizer construction to fail")
    except RuntimeError:
        pass

    try:
        IFieldController()
        raise AssertionError("Expected direct controller construction to fail")
    except RuntimeError:
        pass
