"""Dependencies for EVO-V simulation and nugget workflows."""

from __future__ import annotations

from app.core.container import get_container
from ..core.field_controller import IFieldController, seed_the_ark
from ..evo_v_nextgen import EvolutionaryCulturalOptimizer


def get_field_controller() -> IFieldController:
    """Provide shared seeded field controller owned by the runtime container."""

    controller = get_container().field_controller
    seed_the_ark(controller)
    return controller


def get_evolutionary_optimizer() -> EvolutionaryCulturalOptimizer:
    """Provide shared EVO-V evolutionary optimizer owned by the runtime container."""

    return get_container().evolutionary_optimizer
