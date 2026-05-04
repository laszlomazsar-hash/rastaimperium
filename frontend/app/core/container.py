"""Deprecated compatibility module for runtime container access.
from __future__ import annotations

from dataclasses import dataclass

Use ``evo_v_core.runtime.container.get_container`` instead.
"""

from evo_v_core.runtime.container import get_container

__all__ = ["get_container"]
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
