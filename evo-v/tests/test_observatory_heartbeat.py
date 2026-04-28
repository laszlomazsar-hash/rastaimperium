import asyncio

from api import observatory


class _FakeHealthState:
    def __init__(self) -> None:
        self.called = False

    def mark_heartbeat(self) -> None:
        self.called = True


def test_heartbeat_resolves_health_state_symbol(monkeypatch) -> None:
    fake_health_state = _FakeHealthState()
    monkeypatch.setattr(observatory, "health_state", fake_health_state)
    monkeypatch.setattr(observatory.engine, "audit_state", lambda: {"ok": True})

    result = asyncio.run(observatory.heartbeat())

    assert result["status"] == "ok"
    assert result["snapshot"] == {"ok": True}
    assert fake_health_state.called is True
