"""Self-check helpers for stability heuristics."""

from __future__ import annotations


def self_check(memory) -> str:
    if memory.stability < 0.6:
        return "recover"
    if memory.stability > 1.2:
        return "expand"
    return "steady"
