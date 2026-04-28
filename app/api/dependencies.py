"""Application dependency accessors backed by the central container."""

from __future__ import annotations

from app.ark_engine.core.field_controller import IFieldController
from app.ark_engine.evo_v_nextgen import EvolutionaryCulturalOptimizer
from app.core.container import get_container


def get_evolutionary_optimizer() -> EvolutionaryCulturalOptimizer:
    return get_container().engine


def get_field_controller() -> IFieldController:
    return get_container().field_controller
