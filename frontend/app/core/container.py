from __future__ import annotations

from dataclasses import dataclass

from app.ark_engine.core.field_controller import IFieldController
from app.ark_engine.evo_v_nextgen import EvolutionaryCulturalOptimizer


_CONTAINER_TOKEN = object()


@dataclass(frozen=True)
class AppContainer:
    evolutionary_optimizer: EvolutionaryCulturalOptimizer
    field_controller: IFieldController


_container: AppContainer | None = None


def get_container() -> AppContainer:
    global _container
    if _container is None:
        _container = AppContainer(
            evolutionary_optimizer=EvolutionaryCulturalOptimizer(_container_token=_CONTAINER_TOKEN),
            field_controller=IFieldController(_container_token=_CONTAINER_TOKEN),
        )
    return _container


def is_container_token(token: object | None) -> bool:
    return token is _CONTAINER_TOKEN
