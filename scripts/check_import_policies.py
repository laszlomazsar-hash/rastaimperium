#!/usr/bin/env python3
from __future__ import annotations

import ast
from dataclasses import dataclass
from pathlib import Path
import sys

SOURCE_ROOTS = (Path("backend/src"), Path("tests"))

LEGACY_ALLOWLIST: set[str] = set()
LEGACY_DENY_PREFIXES = ("evo_v", "evo-v")


@dataclass(frozen=True)
class Violation:
    file_path: str
    line: int
    rule: str
    importer: str
    imported: str


def normalize_module(module: str | None) -> str:
    if not module:
        return ""
    return module.replace("-", "_").strip(".")


def module_from_path(path: Path, root: Path) -> str:
    rel = path.relative_to(root)
    parts = list(rel.parts)
    if parts[-1] == "__init__.py":
        parts = parts[:-1]
    else:
        parts[-1] = Path(parts[-1]).stem
    return normalize_module(".".join(parts))


def prefix_match(module: str, prefix: str) -> bool:
    return module == prefix or module.startswith(prefix + ".")


def check_rules(importer: str, imported: str) -> list[str]:
    violations: list[str] = []

    if prefix_match(importer, "codex") and prefix_match(imported, "evo_v_core"):
        violations.append("codex modules cannot import evo_v_core")
    if prefix_match(importer, "evo_v_core.core") and prefix_match(imported, "api"):
        violations.append("evo_v_core/core cannot import api")
    if prefix_match(importer, "api") and prefix_match(imported, "codex"):
        violations.append("api cannot import codex")

    legacy_hit = any(prefix_match(imported, p.replace("-", "_")) for p in LEGACY_DENY_PREFIXES)
    if legacy_hit and imported not in LEGACY_ALLOWLIST:
        violations.append("legacy evo-v package/module imports are forbidden")

    return violations


def extract_imports(tree: ast.AST) -> list[tuple[int, str]]:
    imports: list[tuple[int, str]] = []
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                imports.append((node.lineno, normalize_module(alias.name)))
        elif isinstance(node, ast.ImportFrom):
            module = normalize_module(node.module)
            if module:
                imports.append((node.lineno, module))
    return imports


def scan_file(path: Path, root: Path) -> list[Violation]:
    source = path.read_text(encoding="utf-8")
    tree = ast.parse(source, filename=str(path))
    importer = module_from_path(path, root)
    violations: list[Violation] = []

    for line, imported in extract_imports(tree):
        for rule in check_rules(importer, imported):
            violations.append(
                Violation(
                    file_path=str(path),
                    line=line,
                    rule=rule,
                    importer=importer,
                    imported=imported,
                )
            )
    return violations


def main() -> int:
    repo_root = Path(__file__).resolve().parents[1]
    all_violations: list[Violation] = []

    for root in SOURCE_ROOTS:
        abs_root = repo_root / root
        if not abs_root.exists():
            continue
        for py_file in sorted(abs_root.rglob("*.py")):
            all_violations.extend(scan_file(py_file, abs_root))

    if all_violations:
        for v in all_violations:
            print(f"{v.file_path}:{v.line}: {v.rule} (importer={v.importer}, imported={v.imported})")
        return 1

    print("Import policy check passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
