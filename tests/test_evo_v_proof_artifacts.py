from __future__ import annotations

import sys
from pathlib import Path

import pytest
from pydantic import ValidationError

EVO_V_APP = Path(__file__).resolve().parents[1] / "evo-v" / "app"
if str(EVO_V_APP) not in sys.path:
    sys.path.insert(0, str(EVO_V_APP))

from core.proof_store import ProofStore
from fastapi.testclient import TestClient
from main import app
from models.proof_models import ProofObject


REQUIRED_PROOF_FIELDS = {
    "tick_id": 1,
    "pre_state_hash": "pre",
    "post_state_hash": "post",
    "applied_control": "audit_state",
    "invariant_lemmas": ["lemma"],
    "lyapunov_chain": ["V(pre)", "V(post)"],
    "mpc_chain": ["sense", "act", "commit"],
    "verifier_attestation": "attested",
    "reduction_trace": ["pre", "control", "post"],
}


def test_proof_object_missing_required_fields_raises_validation_error() -> None:
    for field in REQUIRED_PROOF_FIELDS:
        payload = dict(REQUIRED_PROOF_FIELDS)
        payload.pop(field)
        with pytest.raises(ValidationError):
            ProofObject(**payload)


def test_proof_store_assigns_monotonic_ticks(tmp_path: Path) -> None:
    store = ProofStore(storage_dir=tmp_path / "proofs")

    tick_one = store.next_tick_id()
    store.append(ProofObject(**{**REQUIRED_PROOF_FIELDS, "tick_id": tick_one}))

    tick_two = store.next_tick_id()
    store.append(ProofObject(**{**REQUIRED_PROOF_FIELDS, "tick_id": tick_two}))

    assert tick_one == 1
    assert tick_two == 2
    assert store.latest() is not None
    assert store.latest().tick_id == 2


def test_proof_retrieval_endpoints() -> None:
    client = TestClient(app)

    provision_response = client.post("/api/provisioning/provision", params={"agent_name": "proof-tester"})
    assert provision_response.status_code == 200

    latest_response = client.get("/proof/latest")
    assert latest_response.status_code == 200

    latest_tick = latest_response.json()["tick_id"]
    tick_response = client.get(f"/proof/{latest_tick}")
    assert tick_response.status_code == 200
    assert tick_response.json()["tick_id"] == latest_tick
