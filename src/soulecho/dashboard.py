from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List

from .v2 import SoulEchoStreamEngine


@dataclass
class DashboardWidget:
    key: str
    title: str
    gated: bool
    visible: bool


class SoulEchoDashboardService:
    def __init__(self, stream_engine: SoulEchoStreamEngine | None = None) -> None:
        self._stream_engine = stream_engine or SoulEchoStreamEngine()

    def stream_payload(self) -> Dict[str, object]:
        snapshot = self._stream_engine.next_snapshot()
        return {
            "timestamp": snapshot.timestamp,
            "livity_score": snapshot.livity_score,
            "vibration_score": snapshot.vibration_score,
            "energy_schema_version": snapshot.energy_schema_version,
            "energy_components": snapshot.energy_components,
            "layer_metrics": [vars(metric) for metric in snapshot.layer_metrics],
            "mutation_events": snapshot.mutation_events,
        }

    def subscription_widgets(self, plan: str, workspace: str | None = None) -> List[DashboardWidget]:
        enterprise_access = plan.lower() in {"enterprise", "high-ticket"}
        workspace_mode = bool(workspace)

        return [
            DashboardWidget("codex_templates", "Codex Templates", gated=True, visible=plan != "free"),
            DashboardWidget(
                "enterprise_metrics",
                "Enterprise Client Metrics",
                gated=True,
                visible=enterprise_access and workspace_mode,
            ),
        ]
