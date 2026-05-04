from __future__ import annotations

import ast
from pathlib import Path


def _impl_nodes(module: ast.Module):
    allowed_docstring = isinstance(module.body[0], ast.Expr) and isinstance(getattr(module.body[0], "value", None), ast.Constant) and isinstance(module.body[0].value.value, str) if module.body else False
    start_idx = 1 if allowed_docstring else 0
    impl = []
    for node in module.body[start_idx:]:
        if isinstance(node, (ast.Import, ast.ImportFrom)):
            continue
        impl.append(node)
    return impl


def test_legacy_compliance_module_is_shim_only() -> None:
    legacy_path = Path("src/codex/compliance.py")
    canonical_path = Path("backend/src/codex/compliance.py")

    legacy_module = ast.parse(legacy_path.read_text())
    canonical_module = ast.parse(canonical_path.read_text())

    legacy_impl = _impl_nodes(legacy_module)
    canonical_impl = _impl_nodes(canonical_module)

    assert canonical_impl, "Canonical compliance module unexpectedly has no implementation."
    assert not legacy_impl, (
        "Legacy src.codex.compliance must remain a strict shim (imports/docstring only). "
        "Move implementation code into backend/src/codex/compliance.py."
    )
