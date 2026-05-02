"""Composable invariant proof abstractions for EVO-V health checks."""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Callable


class ObligationStatus(str, Enum):
    """Node-level verdict for obligations and proof-tree nodes."""

    VERIFIED = "verified"
    FAILED = "failed"
    UNKNOWN = "unknown"


@dataclass(frozen=True)
class Obligation:
    """A leaf proof obligation evaluated by a deterministic checker."""

    name: str
    evaluator: Callable[[], tuple[ObligationStatus, str | None]]

    def evaluate(self) -> "ProofTreeNode":
        status, reason = self.evaluator()
        return ProofTreeNode(
            name=self.name,
            status=status,
            reason=reason,
            children=[],
        )


@dataclass
class ProofTreeNode:
    """Tree node for compositional proofs over obligations."""

    name: str
    status: ObligationStatus
    reason: str | None = None
    children: list["ProofTreeNode"] = field(default_factory=list)

    def to_dict(self) -> dict[str, object]:
        return {
            "name": self.name,
            "status": self.status.value,
            "reason": self.reason,
            "children": [child.to_dict() for child in self.children],
        }


@dataclass
class Invariant:
    """Invariant family composed from deterministic leaf obligations."""

    name: str
    obligations: list[Obligation]

    def evaluate(self) -> ProofTreeNode:
        leaves = [obligation.evaluate() for obligation in self.obligations]
        status = and_aggregate([leaf.status for leaf in leaves])
        reason = None
        if status is ObligationStatus.FAILED:
            failed_names = [leaf.name for leaf in leaves if leaf.status is ObligationStatus.FAILED]
            reason = f"Failed obligations: {', '.join(failed_names)}"
        elif status is ObligationStatus.UNKNOWN:
            unknown_names = [leaf.name for leaf in leaves if leaf.status is ObligationStatus.UNKNOWN]
            reason = f"Unknown obligations: {', '.join(unknown_names)}"

        return ProofTreeNode(
            name=self.name,
            status=status,
            reason=reason,
            children=leaves,
        )


def and_aggregate(statuses: list[ObligationStatus]) -> ObligationStatus:
    """Deterministic conjunction for proof statuses."""

    if not statuses:
        return ObligationStatus.UNKNOWN
    if any(status is ObligationStatus.FAILED for status in statuses):
        return ObligationStatus.FAILED
    if any(status is ObligationStatus.UNKNOWN for status in statuses):
        return ObligationStatus.UNKNOWN
    return ObligationStatus.VERIFIED


def summarize_tree(root: ProofTreeNode) -> dict[str, object]:
    """Summarize verdict distribution for observability payloads."""

    counts = {
        ObligationStatus.VERIFIED.value: 0,
        ObligationStatus.FAILED.value: 0,
        ObligationStatus.UNKNOWN.value: 0,
    }

    stack = [root]
    while stack:
        node = stack.pop()
        counts[node.status.value] += 1
        stack.extend(node.children)

    return {
        "root": root.name,
        "status": root.status.value,
        "counts": counts,
    }
