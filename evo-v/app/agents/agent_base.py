from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class AgentBase:
    name: str
    status: str = "idle"
    created_at: datetime = field(default_factory=datetime.utcnow)

    def set_status(self, status: str) -> None:
        self.status = status
