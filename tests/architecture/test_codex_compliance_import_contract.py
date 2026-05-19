from __future__ import annotations

import ast
import importlib
import os
import sys
from pathlib import Path


def _repo_root() -> Path:
    return Path(__file__).resolve().parents[2]


def _backend_src_root() -> Path:
    return _repo_root() / "backend" / "src"


def test_codex_compliance_import_contract() -> None:
    backend_src = _backend_src_root()
    assert backend_src.exists(), "Expected backend/src to exist for canonical codex package imports."

    original_sys_path = list(sys.path)
    original_pythonpath = os.environ.get("PYTHONPATH")
    try:
        sys.path = [str(backend_src), *[p for p in sys.path if p != str(backend_src)]]
        os.environ["PYTHONPATH"] = str(backend_src)

        module = importlib.import_module("codex.compliance")
        assert module.__name__ == "codex.compliance"

        assert hasattr(module, "dumps_canonical"), (
            "codex.compliance must expose dumps_canonical directly from the canonical backend package "
            "without requiring imports through src.codex."
        )

        violations: list[str] = []
        codex_root = backend_src / "codex"
        for path in sorted(codex_root.rglob("*.py")):
            tree = ast.parse(path.read_text(encoding="utf-8"), filename=path.as_posix())
            for node in ast.walk(tree):
                if isinstance(node, ast.Import):
                    for alias in node.names:
                        if alias.name == "src.codex" or alias.name.startswith("src.codex."):
                            rel = path.relative_to(_repo_root()).as_posix()
                            violations.append(f"{rel}:{node.lineno} imports {alias.name}")
                elif isinstance(node, ast.ImportFrom) and node.module:
                    if node.module == "src.codex" or node.module.startswith("src.codex."):
                        rel = path.relative_to(_repo_root()).as_posix()
                        violations.append(f"{rel}:{node.lineno} imports {node.module}")

        assert not violations, (
            "Backend codex package must not import from src.codex.\n"
            + "\n".join(violations)
        )
    finally:
        sys.path = original_sys_path
        if original_pythonpath is None:
            os.environ.pop("PYTHONPATH", None)
        else:
            os.environ["PYTHONPATH"] = original_pythonpath
