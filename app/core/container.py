"""Central dependency container for shared application runtime instances."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any

from app.ark_engine.core.field_controller import IFieldController, seed_the_ark
from app.ark_engine.evo_v_nextgen import EvolutionaryCulturalOptimizer
from app.core.monitoring import MonitoringState, monitoring_state


@dataclass(slots=True)
class RuntimeMetadata:
    app_import_path: str = "uvicorn app.main:app"
    created_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


@dataclass(slots=True)
class AppContainer:
    engine: EvolutionaryCulturalOptimizer
    field_controller: IFieldController
    health_state: MonitoringState
    runtime: RuntimeMetadata


_container: AppContainer | None = None


def build_container() -> AppContainer:
    controller = IFieldController()
    seed_the_ark(controller)
    return AppContainer(
        engine=EvolutionaryCulturalOptimizer(),
        field_controller=controller,
        health_state=monitoring_state,
        runtime=RuntimeMetadata(),
    )


def get_container() -> AppContainer:
    global _container
    if _container is None:
        _container = build_container()
    return _container


def container_state_payload() -> dict[str, Any]:
    container = get_container()
    return {
        "engine_id": id(container.engine),
        "field_controller_id": id(container.field_controller),
        "health_state_id": id(container.health_state),
        "runtime": {
            "app_import_path": container.runtime.app_import_path,
            "created_at": container.runtime.created_at,
        },
    }
