from __future__ import annotations

import hashlib
import json
from copy import deepcopy
from dataclasses import dataclass
from datetime import datetime, timezone
from threading import RLock
from typing import Dict, List, Mapping


@dataclass
class AuditRecord:
    actor: str
    action: str
    article: str
    metadata: Dict[str, object]
    timestamp: str
    digest: str


@dataclass(frozen=True)
class TraceCoverageSnapshot:
    revision: int
    coverage: Dict[str, float]


class ComplianceEngine:
    """Article II-IV observability + audit logging + rollback triggers."""

    def __init__(self) -> None:
        self._lock = RLock()
        self._audit_log: List[AuditRecord] = []
        self._trace_coverage: Dict[str, float] = {f"L{i}": 100.0 for i in range(1, 10)}
        self._revision = 0

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
        with self._lock:
            self._audit_log.append(record)
        return record

    def set_trace_coverage(self, layer: str, coverage: float) -> None:
        with self._lock:
            self._trace_coverage[layer] = max(0.0, min(100.0, coverage))
            self._revision += 1

    def trace_coverage_graph(self) -> List[Dict[str, float]]:
        with self._lock:
            return [{"layer": layer, "coverage": value} for layer, value in sorted(self._trace_coverage.items())]

    def should_trigger_rollback(self) -> bool:
        with self._lock:
            return any(v < 80.0 for v in self._trace_coverage.values())

    def snapshot(self) -> TraceCoverageSnapshot:
        """Capture an immutable state view guarded by the registry lock."""
        with self._lock:
            return TraceCoverageSnapshot(
                revision=self._revision,
                coverage=deepcopy(self._trace_coverage),
            )

    def evaluate_candidate_trace_update(self, updates: Mapping[str, float]) -> Dict[str, object]:
        """
        Decide whether a candidate trace update should be accepted.

        The decision is deterministic and race-safe:
        1) capture immutable pre-state under lock,
        2) build/evaluate candidate from that snapshot only,
        3) compute L_old/L_new from immutable snapshots,
        4) commit only if gate passes and revision is unchanged.
        """
        pre_state = self.snapshot()
        candidate_coverage = self._build_candidate_coverage(pre_state.coverage, updates)
        candidate_state = TraceCoverageSnapshot(
            revision=pre_state.revision,
            coverage=candidate_coverage,
        )
        l_old = self._loss(pre_state)
        l_new = self._loss(candidate_state)
        gate_passed = l_new <= l_old

        committed = False
        conflict = False
        if gate_passed:
            with self._lock:
                if self._revision == pre_state.revision:
                    self._trace_coverage = candidate_coverage
                    self._revision += 1
                    committed = True
                else:
                    conflict = True

        return {
            "accepted": committed,
            "gate_passed": gate_passed,
            "conflict": conflict,
            "expected_revision": pre_state.revision,
            "current_revision": self.snapshot().revision,
            "L_old": l_old,
            "L_new": l_new,
        }

    def _build_candidate_coverage(
        self,
        base_coverage: Mapping[str, float],
        updates: Mapping[str, float],
    ) -> Dict[str, float]:
        candidate = dict(base_coverage)
        for layer, coverage in sorted(updates.items()):
            candidate[layer] = max(0.0, min(100.0, coverage))
        return candidate

    def _loss(self, snapshot: TraceCoverageSnapshot) -> float:
        """
        Loss L is deterministic and computed from immutable snapshots only.

        Lower is better; layers below 80% contribute proportional deficit.
        """
        return round(
            sum(max(0.0, 80.0 - value) for value in snapshot.coverage.values()),
            6,
        )

    @property
    def audit_log(self) -> List[AuditRecord]:
        with self._lock:
            return list(self._audit_log)
