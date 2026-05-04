from __future__ import annotations

import ast
from pathlib import Path
from typing import NamedTuple


class FastAPIApp(NamedTuple):
    file_path: Path
    target_name: str
    lineno: int


def find_fastapi_apps(file_path: Path) -> list[FastAPIApp]:
    source = file_path.read_text(encoding="utf-8")
    tree = ast.parse(source)

    fastapi_module_aliases: set[str] = set()
    fastapi_ctor_aliases: set[str] = set()

    for node in tree.body:
        if isinstance(node, ast.Import):
            for alias in node.names:
                if alias.name == "fastapi":
                    fastapi_module_aliases.add(alias.asname or alias.name)
        elif isinstance(node, ast.ImportFrom) and node.module == "fastapi":
            for alias in node.names:
                if alias.name == "FastAPI":
                    fastapi_ctor_aliases.add(alias.asname or alias.name)

    def _is_fastapi_constructor(call: ast.Call) -> bool:
        func = call.func
        if isinstance(func, ast.Name):
            return func.id == "FastAPI" or func.id in fastapi_ctor_aliases
        if isinstance(func, ast.Attribute) and func.attr == "FastAPI":
            base = func.value
            return isinstance(base, ast.Name) and base.id in fastapi_module_aliases
        return False

    apps: list[FastAPIApp] = []
    for node in ast.walk(tree):
        if not isinstance(node, ast.Assign):
            continue
        if not _is_fastapi_constructor(node.value):
            continue
        for target in node.targets:
            if isinstance(target, ast.Name):
                apps.append(FastAPIApp(file_path=file_path, target_name=target.id, lineno=node.lineno))

    return apps
