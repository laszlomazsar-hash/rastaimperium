from typing import Any

from fastapi import APIRouter
from pydantic import BaseModel, Field

from core.replay import verify_replay

router = APIRouter()


class ReplayProofObject(BaseModel):
    metadata: dict[str, Any] = Field(default_factory=dict)
    delta: dict[str, Any] = Field(default_factory=dict)


class ReplayVerifyRequest(BaseModel):
    initial_state: dict[str, Any] = Field(default_factory=dict)
    proof_sequence: list[ReplayProofObject] = Field(default_factory=list)
    expected_hashes: list[str] | None = None


@router.post("/proof/replay/verify")
def replay_verify(payload: ReplayVerifyRequest) -> dict[str, Any]:
    proof_sequence = [proof.model_dump() for proof in payload.proof_sequence]
    return verify_replay(
        initial_state=payload.initial_state,
        proof_sequence=proof_sequence,
        expected_hashes=payload.expected_hashes,
    )
