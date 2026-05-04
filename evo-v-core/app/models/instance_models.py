from pydantic import BaseModel


class InstanceRequest(BaseModel):
    agent_name: str
    requested_by: str


class InstanceRecord(BaseModel):
    instance_id: str
    agent_name: str
    status: str
