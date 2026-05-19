"""Proof-attack diagnostics endpoints."""

from __future__ import annotations

from fastapi import APIRouter

from state import STATE

router = APIRouter()


@router.get("/diagnostics")
def proof_diagnostics() -> dict:
    """Expose proof attack evidence and status for audits."""

    return STATE.proof_snapshot()
