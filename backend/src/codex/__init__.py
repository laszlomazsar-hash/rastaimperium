from importlib import import_module

__all__ = ["ComplianceEngine", "HypothesisPolicy", "HypothesisRecoveryEngine"]


def __getattr__(name: str):
    if name == "ComplianceEngine":
        return getattr(import_module("codex.compliance"), name)
    if name in {"HypothesisPolicy", "HypothesisRecoveryEngine"}:
        return getattr(import_module("codex.hypothesis_recovery"), name)
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")
"""Top-level package for codex.

Public API note:
- Prefer explicit submodule imports for dependency isolation, e.g.
  ``from codex.compliance import ComplianceEngine``.
- Legacy top-level symbol access is retained via lazy attribute loading to
  avoid resolving the full dependency graph during ``import codex``.
"""

from importlib import import_module
from typing import TYPE_CHECKING, Any

__all__ = ["ComplianceEngine", "HypothesisPolicy", "HypothesisRecoveryEngine"]

if TYPE_CHECKING:
    from .compliance import ComplianceEngine
    from .hypothesis_recovery import HypothesisPolicy, HypothesisRecoveryEngine


_LAZY_EXPORTS = {
    "ComplianceEngine": (".compliance", "ComplianceEngine"),
    "HypothesisPolicy": (".hypothesis_recovery", "HypothesisPolicy"),
    "HypothesisRecoveryEngine": (
        ".hypothesis_recovery",
        "HypothesisRecoveryEngine",
    ),
}


def __getattr__(name: str) -> Any:
    module_path, symbol = _LAZY_EXPORTS.get(name, (None, None))
    if module_path is None:
        raise AttributeError(f"module {__name__!r} has no attribute {name!r}")
    module = import_module(module_path, __name__)
    value = getattr(module, symbol)
    globals()[name] = value
    return value
