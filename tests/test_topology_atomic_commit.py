from __future__ import annotations

from dataclasses import dataclass

import pytest

from codex.compliance import ComplianceEngine, TopologyValidationError


@dataclass
class AddNodeOp:
    node_id: str

    def apply(self, topology: dict) -> dict:
        nodes = [*topology.get("nodes", []), {"id": self.node_id}]
        return {**topology, "nodes": nodes}


@dataclass
class AddEdgeOp:
    source: str
    target: str

    def apply(self, topology: dict) -> dict:
        edges = [*topology.get("edges", []), {"source": self.source, "target": self.target}]
        return {**topology, "edges": edges}


@dataclass
class InvalidOp:
    def apply(self, topology: dict) -> dict:
        return {**topology, "edges": [{"source": "missing", "target": "also_missing"}]}


def test_commit_applies_all_ops_and_replaces_registry_atomically() -> None:
    engine = ComplianceEngine()

    committed = engine.apply_topology_operations(
        [AddNodeOp("A"), AddNodeOp("B"), AddEdgeOp("A", "B")]
    )

    assert committed == {
        "nodes": [{"id": "A"}, {"id": "B"}],
        "edges": [{"source": "A", "target": "B"}],
    }
    assert engine.topology_registry == committed


def test_failed_validation_does_not_mutate_registry() -> None:
    engine = ComplianceEngine()
    before = engine.topology_registry

    with pytest.raises(TopologyValidationError):
        engine.apply_topology_operations([InvalidOp()])

    assert engine.topology_registry == before


def test_policy_bounds_are_enforced_for_candidate() -> None:
    engine = ComplianceEngine()
    engine.set_topology_policy_bounds(max_nodes=1)

    with pytest.raises(TopologyValidationError):
        engine.apply_topology_operations([AddNodeOp("A"), AddNodeOp("B")])
