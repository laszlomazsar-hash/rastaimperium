from pathlib import Path

FORBIDDEN = (
    "EvolutionaryCulturalOptimizer()",
    "IFieldController()",
)
ALLOWED_FILES = {
    Path("app/core/container.py"),
    Path("app/ark_engine/api/dependencies_jah.py"),
    Path("app/ark_engine/core/field_controller.py"),
}



def test_no_direct_engine_or_controller_instantiation_outside_container() -> None:
    for file_path in Path("app").rglob("*.py"):
        if file_path in ALLOWED_FILES:
            continue
        source = file_path.read_text()
        for marker in FORBIDDEN:
            assert marker not in source, f"{marker} found in {file_path}"
