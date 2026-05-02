"""Evolution and nugget routes for the ARK Engine."""

from __future__ import annotations

from typing import Any, Dict, List

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from ..dependencies_evo import get_evolutionary_optimizer, get_field_controller
from ...core.field_controller import IFieldController
from ...evo_v_nextgen import EvolutionaryCulturalOptimizer

router = APIRouter()


class CulturalEvolutionRequest(BaseModel):
    initial_cultures: List[Dict[str, Any]]
    steps: int = Field(100, ge=1, le=1000)


class NuggetMeditationRequest(BaseModel):
    vibe: str
    silent: bool = False


@router.post("/evolution/simulate")
async def run_cultural_evolution_simulation(
    request: CulturalEvolutionRequest,
    optimizer: EvolutionaryCulturalOptimizer = Depends(get_evolutionary_optimizer),
) -> Dict[str, Any]:
    """Run the EVO-V cultural evolution simulation."""

    return optimizer.cultural_evolution_simulation(
        initial_cultures=request.initial_cultures,
        steps=request.steps,
    )


@router.post("/nuggets/meditate")
async def meditate_on_nuggets(
    request: NuggetMeditationRequest,
    controller: IFieldController = Depends(get_field_controller),
) -> Dict[str, Any]:
    """Return resonance nuggets for a given vibe."""

    return controller.meditate(vibe=request.vibe, silent=request.silent)
