from __future__ import annotations

import hashlib
import json
from collections import Counter
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Dict, List


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

    def canonical_audit_snapshot_bytes(self) -> bytes:
        """Return canonical snapshot bytes independent of ingestion order.

        Deterministic ordering uses only canonicalized row content. Exact duplicate
        rows are represented with an explicit multiplicity counter to prevent
        runtime ingestion order from affecting emitted bytes.
        """
        row_counts = Counter(self._canonical_row_payload(record) for record in self._audit_log)
        ordered_rows = sorted(
            row_counts.items(),
            key=lambda item: (
                len(item[0]),
                hashlib.sha256(item[0].encode("utf-8")).hexdigest(),
                item[0],
            ),
        )

        snapshot_payload = {
            "format": "compliance_audit_snapshot.v1",
            "rows": [{"count": count, "row": json.loads(row)} for row, count in ordered_rows],
        }
        return json.dumps(snapshot_payload, sort_keys=True, separators=(",", ":")).encode("utf-8")

    @staticmethod
    def _canonical_row_payload(record: AuditRecord) -> str:
        return json.dumps(
            {
                "action": record.action,
                "actor": record.actor,
                "article": record.article,
                "digest": record.digest,
                "metadata": record.metadata,
                "timestamp": record.timestamp,
            },
            sort_keys=True,
            separators=(",", ":"),
        )

    @property
    def audit_log(self) -> List[AuditRecord]:
        return list(self._audit_log)
