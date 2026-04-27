from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Dict, List, Tuple


@dataclass(frozen=True)
class IdGenerationAssumptions:
    """Formal assumptions for compact symbolic identifiers."""

    namespace: str
    id_hex_chars: int
    deterministic_resolution_guarantee: str
    collision_probability_upper_bound: float

    @property
    def id_domain_size(self) -> int:
        # Hex domain cardinality for fixed-width compact IDs.
        return 16 ** self.id_hex_chars


@dataclass
class AuditRecord:
    record_id: str
    actor: str
    action: str
    article: str
    metadata: Dict[str, object]
    timestamp: str
    digest: str


class ComplianceEngine:
    """Article II-IV observability + audit logging + rollback triggers."""

    _RESERVED_OVERFLOW_NAMESPACE = "ovf-"

    def __init__(self, *, id_namespace: str = "codex-audit", id_hex_chars: int = 12) -> None:
        self._audit_log: List[AuditRecord] = []
        self._trace_coverage: Dict[str, float] = {f"L{i}": 100.0 for i in range(1, 10)}
        self._record_ids: Dict[str, str] = {}
        self._collision_count = 0
        self._id_salt = f"{id_namespace}:{id_hex_chars}"
        self._assumptions = IdGenerationAssumptions(
            namespace=id_namespace,
            id_hex_chars=id_hex_chars,
            deterministic_resolution_guarantee=(
                "If a compact ID collides with a distinct digest, the engine deterministically rehashes "
                "using a monotonic counter and fixed salt; if still exhausted, it allocates from a reserved "
                "overflow namespace."
            ),
            collision_probability_upper_bound=1 / (16 ** id_hex_chars),
        )

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
        record_id, collisions_seen = self._allocate_record_id(digest)

        if collisions_seen > 0:
            self._collision_count += collisions_seen
            self._append_collision_event(collided_id=record_id, digest=digest, attempts=collisions_seen)

        record = AuditRecord(record_id=record_id, **payload, digest=digest)
        self._audit_log.append(record)
        self._record_ids[record_id] = digest
        return record

    def _allocate_record_id(self, digest: str) -> Tuple[str, int]:
        collisions_seen = 0

        for counter in range(self._assumptions.id_domain_size):
            compact = self._candidate_id(digest, counter)
            existing_digest = self._record_ids.get(compact)
            if existing_digest is None or existing_digest == digest:
                return compact, collisions_seen
            collisions_seen += 1

        overflow = self._overflow_id(digest)
        if overflow not in self._record_ids or self._record_ids[overflow] == digest:
            return overflow, collisions_seen

        suffix = 1
        while True:
            expanded_overflow = f"{overflow}-{suffix}"
            existing_digest = self._record_ids.get(expanded_overflow)
            if existing_digest is None or existing_digest == digest:
                return expanded_overflow, collisions_seen
            suffix += 1
            collisions_seen += 1

    def _candidate_id(self, digest: str, counter: int) -> str:
        seed = f"{digest}:{self._id_salt}:{counter}"
        return hashlib.sha256(seed.encode("utf-8")).hexdigest()[: self._assumptions.id_hex_chars]

    def _overflow_id(self, digest: str) -> str:
        return f"{self._RESERVED_OVERFLOW_NAMESPACE}{digest[: max(8, self._assumptions.id_hex_chars)]}"

    def _append_collision_event(self, *, collided_id: str, digest: str, attempts: int) -> None:
        timestamp = datetime.now(timezone.utc).isoformat()
        metadata = {
            "event": "id_collision_resolved",
            "collided_record_id": collided_id,
            "collision_attempts": attempts,
            "resolved_digest": digest,
        }
        payload = {
            "actor": "system",
            "action": "id_collision_resolved",
            "article": "IV",
            "metadata": metadata,
            "timestamp": timestamp,
        }
        event_digest = hashlib.sha256(json.dumps(payload, sort_keys=True).encode("utf-8")).hexdigest()
        event_id = self._overflow_id(event_digest)
        while event_id in self._record_ids and self._record_ids[event_id] != event_digest:
            event_id = f"{event_id}-evt"

        event = AuditRecord(record_id=event_id, **payload, digest=event_digest)
        self._audit_log.append(event)
        self._record_ids[event_id] = event_digest

    def id_state_assumptions(self) -> Dict[str, object]:
        return {
            "namespace": self._assumptions.namespace,
            "id_hex_chars": self._assumptions.id_hex_chars,
            "id_domain_size": self._assumptions.id_domain_size,
            "collision_probability_upper_bound": self._assumptions.collision_probability_upper_bound,
            "deterministic_resolution_guarantee": self._assumptions.deterministic_resolution_guarantee,
            "reserved_overflow_namespace": self._RESERVED_OVERFLOW_NAMESPACE,
        }

    def validate_runtime_state(self) -> bool:
        seen_ids = set()
        for record in self._audit_log:
            if record.record_id in seen_ids:
                return False
            seen_ids.add(record.record_id)

            stored_digest = self._record_ids.get(record.record_id)
            if stored_digest != record.digest:
                return False

            if record.record_id.startswith(self._RESERVED_OVERFLOW_NAMESPACE):
                continue

            if len(record.record_id) != self._assumptions.id_hex_chars:
                return False

        return True

    def set_trace_coverage(self, layer: str, coverage: float) -> None:
        self._trace_coverage[layer] = max(0.0, min(100.0, coverage))

    def trace_coverage_graph(self) -> List[Dict[str, float]]:
        return [{"layer": layer, "coverage": value} for layer, value in sorted(self._trace_coverage.items())]

    def should_trigger_rollback(self) -> bool:
        return any(v < 80.0 for v in self._trace_coverage.values())

    @property
    def audit_log(self) -> List[AuditRecord]:
        return list(self._audit_log)

    @property
    def collision_count(self) -> int:
        return self._collision_count
