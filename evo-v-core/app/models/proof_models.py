from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field


class ProofObject(BaseModel):
    """Structured artifact emitted for each runtime state transition tick."""

    model_config = ConfigDict(extra="forbid")

    tick_id: int = Field(..., ge=1)
    pre_state_hash: str = Field(..., min_length=1)
    post_state_hash: str = Field(..., min_length=1)
    applied_control: str = Field(..., min_length=1)
    invariant_lemmas: list[str] = Field(..., min_length=1)
    lyapunov_chain: list[str] = Field(..., min_length=1)
    mpc_chain: list[str] = Field(..., min_length=1)
    verifier_attestation: str = Field(..., min_length=1)
    reduction_trace: list[str] = Field(..., min_length=1)
