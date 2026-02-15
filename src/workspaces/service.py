from __future__ import annotations

from dataclasses import dataclass


@dataclass
class Workspace:
    workspace_id: str
    client_name: str
    seats: int
    subscription_tier: str


def can_access_codex(workspace: Workspace) -> bool:
    return workspace.subscription_tier in {"mid-tier", "enterprise", "high-ticket"}
