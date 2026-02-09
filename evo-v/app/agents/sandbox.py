import asyncio
from typing import Optional

from .reasoning_agent import ReasoningAgent


class Sandbox:
    def __init__(self, agent: ReasoningAgent) -> None:
        self.agent = agent
        self._last_payload: Optional[str] = None

    async def execute(self) -> None:
        self.agent.set_status("running")
        await asyncio.sleep(0.1)
        payload = self._last_payload or "heartbeat"
        self.agent.evaluate(payload)
        self.agent.set_status("idle")

    def queue_payload(self, payload: str) -> None:
        self._last_payload = payload
