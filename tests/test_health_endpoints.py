from pathlib import Path


def test_health_observability_routes_declared() -> None:
    source = Path("app/main.py").read_text()
    for route in ("/healthz", "/live", "/ready", "/metrics"):
        assert f'@app.get("{route}")' in source


def test_vocabulary_tooltips_route_declared() -> None:
    source = Path("app/main.py").read_text()
    assert "@app.get(\"/vocabulary-tooltips\")" in source


def test_start_here_routes_declared() -> None:
    source = Path("app/main.py").read_text()
    assert "@app.get(\"/start-here\")" in source
    assert "@app.get(\"/welcome\")" in source


def test_homepage_contains_start_here_and_tooltips() -> None:
    source = Path("app/templates/index.html").read_text()
    assert 'href="/start-here"' in source
    assert 'class="term"' in source


def test_codex_store_routes_declared() -> None:
    source = Path("app/main.py").read_text()
    assert "@app.get(\"/codex\")" in source
    assert "@app.get(\"/store\")" in source


def test_homepage_codex_gateway_links() -> None:
    source = Path("app/templates/index.html").read_text()
    assert 'href="/codex" class="btn btn-tertiary"' in source
    assert "Open Codex Library" in source
