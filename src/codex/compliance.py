from __future__ import annotations

import hashlib
import json
from copy import deepcopy
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any, Dict, List, Protocol


class TopologyOperation(Protocol):
    """Pure topology operation.

    Implementations must be side-effect free and return a new candidate topology
    based on the provided input topology.
    """

    def apply(self, topology: Dict[str, Any]) -> Dict[str, Any]:
        """Return a new topology candidate."""


class TopologyValidationError(ValueError):
    """Raised when a candidate topology violates integrity or policy bounds."""


@dataclass
class AuditRecord:
    actor: str
    action: str
    article: str
    metadata: Dict[str, object]
    timestamp: str
    digest: str


class ComplianceEngine:
    """Article II-IV observability + audit logging + rollback triggers."""

    def __init__(self) -> None:
        self._audit_log: List[AuditRecord] = []
        self._trace_coverage: Dict[str, float] = {f"L{i}": 100.0 for i in range(1, 10)}
        self._topology_registry: Dict[str, Any] = {"nodes": [], "edges": []}
        self._topology_policy_bounds: Dict[str, int] = {
            "min_nodes": 0,
            "max_nodes": 1000,
            "max_edges": 5000,
            "max_degree": 64,
        }

    def append_audit_record(self, actor: str, action: str, article: str, metadata: Dict[str, object]) -> AuditRecord:
        timestamp = datetime.now(timezone.utc).isoformat()
        payload = {
            "actor": actor,
            "action": action,
            "article": article,
            "metadata": metadata,
            "timestamp": timestamp,
        }
        digest = hashlib.sha256(json.dumps(payload, sort_keys=True).encode("utf-8")).hexdigest()
        record = AuditRecord(**payload, digest=digest)
        self._audit_log.append(record)
        return record

    def set_trace_coverage(self, layer: str, coverage: float) -> None:
        self._trace_coverage[layer] = max(0.0, min(100.0, coverage))

    def trace_coverage_graph(self) -> List[Dict[str, float]]:
        return [{"layer": layer, "coverage": value} for layer, value in sorted(self._trace_coverage.items())]

    def should_trigger_rollback(self) -> bool:
        return any(v < 80.0 for v in self._trace_coverage.values())

    def set_topology_policy_bounds(
        self,
        *,
        min_nodes: int | None = None,
        max_nodes: int | None = None,
        max_edges: int | None = None,
        max_degree: int | None = None,
    ) -> None:
        updates = {
            "min_nodes": min_nodes,
            "max_nodes": max_nodes,
            "max_edges": max_edges,
            "max_degree": max_degree,
        }
        for key, value in updates.items():
            if value is not None:
                if value < 0:
                    raise ValueError(f"{key} cannot be negative")
                self._topology_policy_bounds[key] = value

    def apply_topology_operations(self, ops: List[TopologyOperation]) -> Dict[str, Any]:
        """Apply topology operations transactionally with a single atomic commit.

        1. Create immutable pre-state snapshot.
        2. Build full candidate topology in memory via pure operations.
        3. Validate candidate (ids, cardinality, policy bounds).
        4. Commit once by replacing the registry reference.
        """

        pre_state_snapshot = deepcopy(self._topology_registry)
        candidate = pre_state_snapshot

        for op in ops:
            candidate = op.apply(candidate)

        self._validate_candidate_topology(candidate)

        committed = deepcopy(candidate)
        self._topology_registry = committed
        return deepcopy(committed)

    def _validate_candidate_topology(self, candidate: Dict[str, Any]) -> None:
        nodes = candidate.get("nodes", [])
        edges = candidate.get("edges", [])

        if not isinstance(nodes, list) or not isinstance(edges, list):
            raise TopologyValidationError("Topology must contain list-valued 'nodes' and 'edges'.")

        node_ids = [node.get("id") for node in nodes if isinstance(node, dict)]
        if len(node_ids) != len(nodes) or any(node_id is None for node_id in node_ids):
            raise TopologyValidationError("Every node must be a dict containing a non-null 'id'.")
        if len(set(node_ids)) != len(node_ids):
            raise TopologyValidationError("Node IDs must be unique.")

        node_set = set(node_ids)
        degree_map = {node_id: 0 for node_id in node_ids}

        for edge in edges:
            if not isinstance(edge, dict):
                raise TopologyValidationError("Every edge must be a dict.")
            source = edge.get("source")
            target = edge.get("target")
            if source not in node_set or target not in node_set:
                raise TopologyValidationError("All edges must reference existing node IDs.")
            degree_map[source] += 1
            degree_map[target] += 1

        bounds = self._topology_policy_bounds
        if len(nodes) < bounds["min_nodes"]:
            raise TopologyValidationError("Node count is below policy minimum.")
        if len(nodes) > bounds["max_nodes"]:
            raise TopologyValidationError("Node count exceeds policy maximum.")
        if len(edges) > bounds["max_edges"]:
            raise TopologyValidationError("Edge count exceeds policy maximum.")
        if any(deg > bounds["max_degree"] for deg in degree_map.values()):
            raise TopologyValidationError("Node degree exceeds policy maximum.")

    @property
    def audit_log(self) -> List[AuditRecord]:
        return list(self._audit_log)

    @property
    def topology_registry(self) -> Dict[str, Any]:
        return deepcopy(self._topology_registry)
