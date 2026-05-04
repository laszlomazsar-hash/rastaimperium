from pathlib import Path


def test_evo_v_root_route_is_declared() -> None:
    source = Path("evo-v-core/app/main.py").read_text()
    assert '@app.get("/")' in source
    assert '"status": "EVO-V ONLINE"' in source


def test_evo_v_health_router_is_included() -> None:
    source = Path("evo-v-core/app/main.py").read_text()
    assert "app.include_router(health_router)" in source


def test_evo_v_watchdog_forces_hf_recovery_contract() -> None:
    source = Path("evo-v-core/app/watchdog.py").read_text()
    assert "os._exit(1)" in source
    assert "WATCHDOG_INTERVAL_SECONDS = 10" in source


def test_evo_v_bootstrap_enforces_port_contract() -> None:
    source = Path("infra/bootstrap-evo-v.sh").read_text()
    assert 'PORT="${PORT:-7860}"' in source
    assert 'uvicorn app.main:app --host 0.0.0.0 --port "${PORT}"' in source
