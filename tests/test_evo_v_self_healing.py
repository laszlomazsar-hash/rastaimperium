import hashlib
import json
import sys
from pathlib import Path

from fastapi.testclient import TestClient

EVO_V_APP_PATH = Path(__file__).resolve().parents[1] / "evo-v" / "app"
if str(EVO_V_APP_PATH) not in sys.path:
    sys.path.insert(0, str(EVO_V_APP_PATH))

import main  # type: ignore  # noqa: E402
from api import observatory  # type: ignore  # noqa: E402
import watchdog  # type: ignore  # noqa: E402
from state import STATE  # type: ignore  # noqa: E402


def _hash_payload(payload: dict) -> str:
    canonical = json.dumps(payload, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()


def _reset_runtime_state() -> None:
    with STATE.lock:
        STATE.last_check = None
        STATE.failure_count = 0
        STATE.last_failure = None
        STATE.watchdog_started = False


def test_evo_v_root_and_health_routes_are_live() -> None:
    client = TestClient(main.app)

    root_resp = client.get("/")
    assert root_resp.status_code == 200
    assert root_resp.json()["status"] == "EVO-V ONLINE"

    health_resp = client.get("/health")
    assert health_resp.status_code == 200
    assert "invariants" in health_resp.json()

    state_resp = client.get("/state")
    assert state_resp.status_code == 200
    assert state_resp.json()["mode"] == "deterministic-runtime"


def test_evo_v_watchdog_single_start_semantics(monkeypatch) -> None:
    _reset_runtime_state()
    thread_starts: list[str] = []

    class FakeThread:
        def __init__(self, target, args, daemon, name):
            self.target = target
            self.args = args
            self.daemon = daemon
            self.name = name

        def start(self) -> None:
            thread_starts.append(self.name)

    monkeypatch.setattr(watchdog.threading, "Thread", FakeThread)

    app_stub = object()
    watchdog.start_watchdog(app_stub)
    watchdog.start_watchdog(app_stub)

    assert thread_starts == ["evo-v-watchdog"]


def test_evo_v_watchdog_failure_updates_runtime_state(monkeypatch) -> None:
    _reset_runtime_state()

    def fake_exit(code: int) -> None:
        raise SystemExit(code)

    monkeypatch.setattr(watchdog.os, "_exit", fake_exit)

    try:
        watchdog.monitor_loop(object())
    except SystemExit as exc:
        assert exc.code == 1

    assert STATE.failure_count == 1
    assert STATE.last_failure == "ROUTE_TABLE_CORRUPTED"


def test_evo_v_deterministic_replay_produces_stable_state_hashes() -> None:
    client = TestClient(main.app)

    first = client.get("/api/observatory/heartbeat").json()["snapshot"]
    second = client.get("/api/observatory/heartbeat").json()["snapshot"]

    assert first == second
    assert _hash_payload(first) == _hash_payload(second)


def test_evo_v_adversarial_invalid_proof_is_surfaceable(monkeypatch) -> None:
    adversarial_snapshot = {
        "agents": [],
        "statuses": [],
        "active_sandboxes": 0,
        "proof_status": "INVALID",
        "compromise": "proof-chain-tampered",
    }

    monkeypatch.setattr(observatory.engine, "audit_state", lambda: adversarial_snapshot)
    client = TestClient(main.app)

    response = client.get("/api/observatory/heartbeat")
    assert response.status_code == 200

    payload = response.json()
    assert payload["snapshot"]["proof_status"] == "INVALID"
    assert payload["snapshot"]["compromise"] == "proof-chain-tampered"


def test_evo_v_bootstrap_enforces_port_contract() -> None:
    source = Path("evo-v/bootstrap.sh").read_text()
    assert 'PORT="${PORT:-7860}"' in source
    assert 'uvicorn app.main:app --host 0.0.0.0 --port "${PORT}"' in source
