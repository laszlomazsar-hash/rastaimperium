from pathlib import Path

# Only dedicated composition roots may instantiate engine/controller objects.
# - app/core/container.py: central DI container/composition root for wiring runtime objects.
# Any dependency modules (for example app/api/dependencies.py and
# app/ark_engine/api/dependencies_evo.py) must remain constructor-free pass-through layers.
ALLOWED_FILES = {
    "app/core/container.py",
    "app/api/v1/endpoints.py",
}


TARGET_DIRS = (
    Path("app"),
    Path("frontend/app"),
)

FORBIDDEN_CALL_PATTERNS = (
    r"(?<!class\s)\bFieldController\(",
    r"(?<!class\s)\bEvolutionaryOptimizer\(",
    r"(?<!class\s)\bEvolutionaryCulturalOptimizer\(",
    r"(?<!class\s)\bCodexEngine\(",
)


def _iter_python_files() -> list[Path]:
    files: list[Path] = []
    for root in TARGET_DIRS:
        if not root.exists():
            continue
        files.extend(path for path in root.rglob("*.py") if path.name != "__init__.py")
    return files


def _is_allowed(path: Path) -> bool:
    normalized = path.as_posix()
    if normalized.startswith("frontend/"):
        normalized = normalized[len("frontend/") :]
    return normalized in ALLOWED_FILES


def test_engine_and_controller_constructors_are_container_scoped() -> None:
    violations: list[str] = []

    for py_file in _iter_python_files():
        if _is_allowed(py_file):
            continue

        source = py_file.read_text(encoding="utf-8")
        import re
        if any(re.search(pattern, source) for pattern in FORBIDDEN_CALL_PATTERNS):
            violations.append(py_file.as_posix())

    assert violations == [], (
        "Direct engine/controller construction found outside approved DI wiring modules: "
        + ", ".join(sorted(violations))
    )
