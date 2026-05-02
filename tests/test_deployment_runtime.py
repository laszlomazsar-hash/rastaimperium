from pathlib import Path


def test_procfile_binds_to_railway_port_and_host() -> None:
    procfile = Path("Procfile").read_text().strip()
    assert procfile.startswith("web: uvicorn ")
    assert "--host 0.0.0.0" in procfile
    assert "--port $PORT" in procfile


def test_python_runtime_is_pinned_to_311_for_stability() -> None:
    runtime = Path("runtime.txt").read_text().strip()
    py_version = Path(".python-version").read_text().strip()

    assert runtime.startswith("python-3.11")
    assert py_version == "3.11"
