from dataclasses import dataclass

from app.ark_engine.core.field_controller import IFieldController
from app.ark_engine.evo_v_nextgen import EvolutionaryCulturalOptimizer


@dataclass
class AppContainer:
    evolutionary_optimizer: EvolutionaryCulturalOptimizer
    field_controller: IFieldController


_container = AppContainer(
    evolutionary_optimizer=EvolutionaryCulturalOptimizer(),
    field_controller=IFieldController(),
)


def get_container() -> AppContainer:
    """Return the canonical runtime composition container instance."""
    return _container
