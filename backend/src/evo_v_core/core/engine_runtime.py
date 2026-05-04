"""Compatibility shim for engine runtime access.

This module re-exports runtime state engine accessors so legacy imports from
``core.engine_runtime`` continue to work while using ``core.runtime_state`` as
the single source of truth.
"""

from __future__ import annotations

from core.runtime_state import get_engine, initialize_runtime

__all__ = ["get_engine", "initialize_runtime", "engine"]


def __getattr__(name: str):
    if name == "engine":
        return get_engine()
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")
