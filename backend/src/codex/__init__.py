from importlib import import_module

__all__ = ["ComplianceEngine", "HypothesisPolicy", "HypothesisRecoveryEngine"]


def __getattr__(name: str):
    if name == "ComplianceEngine":
        return getattr(import_module("codex.compliance"), name)
    if name in {"HypothesisPolicy", "HypothesisRecoveryEngine"}:
        return getattr(import_module("codex.hypothesis_recovery"), name)
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")
