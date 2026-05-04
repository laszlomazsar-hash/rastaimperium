"""Dependencies for EVO-V simulation and nugget workflows."""

from __future__ import annotations

from functools import lru_cache

from ..core.field_controller import IFieldController, seed_the_ark
from ..evo_v_nextgen import EvolutionaryCulturalOptimizer


@lru_cache
def get_field_controller() -> IFieldController:
    """Provide a seeded field controller for nugget meditation."""

    controller = IFieldController()
    seed_the_ark(controller)
    return controller


def get_evolutionary_optimizer() -> EvolutionaryCulturalOptimizer:
    """Provide a fresh EVO-V evolutionary optimizer per request."""

    return EvolutionaryCulturalOptimizer()
