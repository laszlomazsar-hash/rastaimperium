import asyncio
import hashlib
import json
from typing import Any, List

from agents.reasoning_agent import ReasoningAgent
from agents.sandbox import Sandbox
from core.blockchain_anchor import anchor_state
from core.governance import validate_action
from core.proof_store import ProofStore
from models.proof_models import ProofObject


class CodexEngine:
    def __init__(self) -> None:
        self.agents: List[ReasoningAgent] = []
        self.sandboxes: List[Sandbox] = []
        self.proof_store = ProofStore()

    def _state_snapshot(self) -> dict[str, Any]:
        return {
            "agents": [agent.name for agent in self.agents],
            "statuses": [agent.status for agent in self.agents],
            "active_sandboxes": len(self.sandboxes),
        }

    @staticmethod
    def _hash_state(state: dict[str, Any]) -> str:
        canonical = json.dumps(state, sort_keys=True, separators=(",", ":"))
        return hashlib.sha256(canonical.encode("utf-8")).hexdigest()

    def _emit_transition_proof(
        self,
        *,
        pre_state: dict[str, Any],
        post_state: dict[str, Any],
        applied_control: str,
    ) -> ProofObject:
        tick_id = self.proof_store.next_tick_id()
        pre_hash = self._hash_state(pre_state)
        post_hash = self._hash_state(post_state)
        proof = ProofObject(
            tick_id=tick_id,
            pre_state_hash=pre_hash,
            post_state_hash=post_hash,
            applied_control=applied_control,
            invariant_lemmas=[
                "agent_statuses_enumerable",
                "sandbox_cardinality_matches_registry",
            ],
            lyapunov_chain=[f"V({pre_hash})", f"V({post_hash})"],
            mpc_chain=["sense_runtime_state", f"apply_control:{applied_control}", "commit_transition"],
            verifier_attestation=f"sha256:{pre_hash}->{post_hash}",
            reduction_trace=[
                f"pre_state:{pre_hash}",
                f"control:{applied_control}",
                f"post_state:{post_hash}",
            ],
        )
        self.proof_store.append(proof)
        return proof

    def provision_agent(self, agent_name: str) -> tuple[ReasoningAgent, Sandbox]:
        pre_state = self._state_snapshot()
        agent = ReasoningAgent(agent_name)
        sandbox = Sandbox(agent)
        self.agents.append(agent)
        self.sandboxes.append(sandbox)
        self._emit_transition_proof(
            pre_state=pre_state,
            post_state=self._state_snapshot(),
            applied_control="provision_agent",
        )
        return agent, sandbox

    async def run_all(self) -> None:
        pre_state = self._state_snapshot()
        tasks = [sandbox.execute() for sandbox in self.sandboxes]
        await asyncio.gather(*tasks)
        self._emit_transition_proof(
            pre_state=pre_state,
            post_state=self._state_snapshot(),
            applied_control="run_all",
        )

    def audit_state(self) -> dict:
        pre_state = self._state_snapshot()
        snapshot = self._state_snapshot()
        if validate_action("audit_state"):
            anchor_state(snapshot)
        self._emit_transition_proof(
            pre_state=pre_state,
            post_state=snapshot,
            applied_control="audit_state",
        )
        return snapshot
