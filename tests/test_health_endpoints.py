from pathlib import Path


def test_health_observability_routes_declared() -> None:
    source = Path("app/main.py").read_text()
    for route in ("/healthz", "/live", "/ready", "/metrics"):
        assert f'@app.get("{route}")' in source
