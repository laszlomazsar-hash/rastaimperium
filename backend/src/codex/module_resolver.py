from pathlib import Path

ROOT = Path("backend/src")


def resolve_module_name(path: Path | str) -> str:
    """Resolve a Python file path to an importable module path under backend/src."""
    file_path = Path(path)
    relative_path = file_path.relative_to(ROOT)

    if relative_path.suffix == ".py":
        relative_path = relative_path.with_suffix("")

    parts = relative_path.parts
    if parts and parts[-1] == "__init__":
        parts = parts[:-1]

    return ".".join(parts)
