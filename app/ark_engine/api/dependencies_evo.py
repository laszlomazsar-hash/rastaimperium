"""Compatibility shim for EVO-V dependencies.

Deprecated: import from ``app.api.dependencies`` for the central container wiring.
"""

from __future__ import annotations

from app.api.dependencies import get_evolutionary_optimizer, get_field_controller

__all__ = ["get_evolutionary_optimizer", "get_field_controller"]
