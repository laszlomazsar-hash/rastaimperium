from __future__ import annotations

from dataclasses import dataclass
from threading import Lock

from app.ark_engine.core.field_controller import IFieldController
from app.ark_engine.evo_v_nextgen import EvolutionaryCulturalOptimizer


@dataclass
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
