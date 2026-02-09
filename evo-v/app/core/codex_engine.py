import asyncio
from typing import List

from agents.reasoning_agent import ReasoningAgent
from agents.sandbox import Sandbox
from core.blockchain_anchor import anchor_state
from core.governance import validate_action


class CodexEngine:
    def __init__(self) -> None:
        self.agents: List[ReasoningAgent] = []
        self.sandboxes: List[Sandbox] = []

    def provision_agent(self, agent_name: str) -> tuple[ReasoningAgent, Sandbox]:
        agent = ReasoningAgent(agent_name)
        sandbox = Sandbox(agent)
        self.agents.append(agent)
        self.sandboxes.append(sandbox)
        return agent, sandbox

    async def run_all(self) -> None:
        tasks = [sandbox.execute() for sandbox in self.sandboxes]
        await asyncio.gather(*tasks)

    def audit_state(self) -> dict:
        snapshot = {
            "agents": [agent.name for agent in self.agents],
            "statuses": [agent.status for agent in self.agents],
            "active_sandboxes": len(self.sandboxes),
        }
        if validate_action("audit_state"):
            anchor_state(snapshot)
        return snapshot
