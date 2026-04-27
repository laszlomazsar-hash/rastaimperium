import asyncio
from typing import List

from agents.reasoning_agent import ReasoningAgent
from agents.sandbox import Sandbox
from core.blockchain_anchor import anchor_state
from core.governance import validate_action
from state import EngineState


class CodexEngine:
    def __init__(self) -> None:
        self.agents: List[ReasoningAgent] = []
        self.sandboxes: List[Sandbox] = []
        self.state = EngineState()

    def provision_agent(self, agent_name: str) -> tuple[ReasoningAgent, Sandbox]:
        normalized_name = agent_name.strip()
        if not normalized_name:
            raise ValueError("agent_name must not be empty")

        agent = ReasoningAgent(normalized_name)
        sandbox = Sandbox(agent)
        self.agents.append(agent)
        self.sandboxes.append(sandbox)
        self.state.transition(agent_name=agent.name, status=agent.status)
        return agent, sandbox

    async def run_all(self) -> None:
        if not self.sandboxes:
            return
        tasks = [sandbox.execute() for sandbox in self.sandboxes]
        try:
            await asyncio.gather(*tasks)
        except Exception as exc:
            self.state.mark_failure(agent_name="engine", error=str(exc))
            raise
        finally:
            for agent in self.agents:
                self.state.transition(agent_name=agent.name, status=agent.status)

    def audit_state(self) -> dict:
        self.state.mark_heartbeat(active_sandboxes=len(self.sandboxes))
        state_snapshot = self.state.read_snapshot()
        snapshot = {
            "agents": [agent.name for agent in self.agents],
            "statuses": [agent.status for agent in self.agents],
            "active_sandboxes": len(self.sandboxes),
            "state": state_snapshot["state"],
            "events": state_snapshot["events"],
        }
        if validate_action("audit_state"):
            anchor_state(snapshot)
        return snapshot
