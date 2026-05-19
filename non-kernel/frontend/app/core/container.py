"""Deprecated compatibility module for runtime container access.
from __future__ import annotations

from dataclasses import dataclass
from threading import Lock

Use ``evo_v_core.runtime.container.get_container`` instead.
"""

from evo_v_core.runtime.container import get_container

__all__ = ["get_container"]
_CONTAINER_TOKEN = object()


@dataclass(frozen=True)
class AppContainer:
    evolutionary_optimizer: EvolutionaryCulturalOptimizer
    field_controller: IFieldController

    _instance: "AppContainer | None" = None
    _init_lock: Lock = Lock()

    @classmethod
    def _bootstrap(cls) -> "AppContainer":
        """Build application dependencies in one place.

        Keep side effects limited to object construction so repeated calls remain safe.
        """

        return cls(
            evolutionary_optimizer=EvolutionaryCulturalOptimizer(),
            field_controller=IFieldController(),
        )

    @classmethod
    def get(cls) -> "AppContainer":
        # Fast path for already initialized process state.
        instance = cls._instance
        if instance is not None:
            return instance

        # Slow path for first call; guarded for multi-thread bootstrap.
        with cls._init_lock:
            # Double-check to avoid duplicate initialization races.
            instance = cls._instance
            if instance is None:
                instance = cls._bootstrap()
                cls._instance = instance

        return instance


def get_container() -> AppContainer:
    return AppContainer.get()
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
