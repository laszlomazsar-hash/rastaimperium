import asyncio

import pytest
from fastapi import HTTPException

from agents.reasoning_agent import ReasoningAgent
from agents.sandbox import Sandbox
from api.provisioning import provision_instance
from core.codex_engine import CodexEngine


def test_provision_agent_rejects_blank_names() -> None:
    engine = CodexEngine()

    with pytest.raises(ValueError, match="agent_name must not be empty"):
        engine.provision_agent("   ")


def test_provision_agent_normalizes_whitespace() -> None:
    engine = CodexEngine()

    agent, _sandbox = engine.provision_agent("  alpha  ")

    assert agent.name == "alpha"


def test_sandbox_execute_returns_to_idle() -> None:
    sandbox = Sandbox(ReasoningAgent("alpha"))
    sandbox.queue_payload("ping")

    asyncio.run(sandbox.execute())

    assert sandbox.agent.status == "idle"


def test_sandbox_execute_preserves_frozen_status() -> None:
    sandbox = Sandbox(ReasoningAgent("alpha"))
    sandbox.queue_payload("ping")
    sandbox.agent.set_status("frozen")

    asyncio.run(sandbox.execute())

    assert sandbox.agent.status == "frozen"


def test_provision_endpoint_maps_validation_error_to_http_400() -> None:
    with pytest.raises(HTTPException) as exc_info:
        provision_instance("   ")

    assert exc_info.value.status_code == 400
