"""Deterministic state placeholders for evo-v runtime."""

from dataclasses import dataclass
from typing import Mapping, Any


@dataclass(frozen=True)
class RuntimeState:
    """Immutable runtime state used by deterministic replay."""

    lifecycle: str
    attributes: Mapping[str, Any]
