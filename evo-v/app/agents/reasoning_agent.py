from .agent_base import AgentBase


class ReasoningAgent(AgentBase):
    def __init__(self, name: str) -> None:
        super().__init__(name=name)
        self.status = "ready"

    def evaluate(self, payload: str) -> str:
        self.set_status("evaluating")
        response = f"Agent {self.name} processed: {payload}"
        self.set_status("ready")
        return response
