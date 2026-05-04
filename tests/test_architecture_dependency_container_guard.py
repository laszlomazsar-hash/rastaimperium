from pathlib import Path
import re

from tests.architecture.policy import (
    DI_ALLOWLIST_FILES,
    DI_OPTIONAL_ALLOWLIST_FILES,
    DI_TARGET_DIRS,
    FORBIDDEN_DEPENDENCY_EDGES,
)


def _iter_python_files() -> list[Path]:
    files: list[Path] = []
    for root in DI_TARGET_DIRS:
        if not root.exists():
            continue
        files.extend(path for path in root.rglob("*.py") if path.name != "__init__.py")
    return files


def _is_allowed(path: Path) -> bool:
    normalized = path.as_posix()
    if normalized.startswith("frontend/"):
        normalized = normalized[len("frontend/") :]
    return normalized in (DI_ALLOWLIST_FILES | DI_OPTIONAL_ALLOWLIST_FILES)


def _find_constructor_violations() -> list[str]:
    violations: list[str] = []

    for py_file in _iter_python_files():
        if _is_allowed(py_file):
            continue

        source = py_file.read_text(encoding="utf-8")
        if any(re.search(pattern, source) for pattern in FORBIDDEN_DEPENDENCY_EDGES):
            violations.append(py_file.as_posix())

    return violations


def test_engine_and_controller_constructors_are_container_scoped() -> None:
    violations = _find_constructor_violations()

    assert violations == [], (
        "Direct engine/controller construction found outside approved DI wiring modules: "
        + ", ".join(sorted(violations))
    )


def test_constructor_guard_allows_only_allowlisted_wiring_modules(tmp_path: Path, monkeypatch) -> None:
    frontend_app_root = tmp_path / "frontend" / "app"
    allowed_file = frontend_app_root / "api" / "v1" / "endpoints.py"
    forbidden_file = frontend_app_root / "services" / "worker.py"

    allowed_file.parent.mkdir(parents=True, exist_ok=True)
    forbidden_file.parent.mkdir(parents=True, exist_ok=True)

    allowed_file.write_text("def build():\n    return CodexEngine()\n", encoding="utf-8")
    forbidden_file.write_text("def build():\n    return CodexEngine()\n", encoding="utf-8")

    monkeypatch.chdir(tmp_path)
    monkeypatch.setattr(__import__(__name__), "DI_TARGET_DIRS", (Path("frontend/app"),))
    monkeypatch.setattr(__import__(__name__), "DI_ALLOWLIST_FILES", {"app/api/v1/endpoints.py"})

    assert _find_constructor_violations() == ["frontend/app/services/worker.py"]
