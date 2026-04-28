from fastapi import APIRouter, HTTPException

from core.proof_store import ProofStore
from models.proof_models import ProofObject

router = APIRouter()
store = ProofStore()


@router.get("/proof/latest", response_model=ProofObject)
def get_latest_proof() -> ProofObject:
    proof = store.latest()
    if proof is None:
        raise HTTPException(status_code=404, detail="no proofs emitted yet")
    return proof


@router.get("/proof/{tick}", response_model=ProofObject)
def get_proof(tick: int) -> ProofObject:
    proof = store.get(tick)
    if proof is None:
        raise HTTPException(status_code=404, detail="proof tick not found")
    return proof
