from __future__ import annotations

import hashlib
import json
import math
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Dict, List, Sequence


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

    def __init__(self, geometry_budget_per_tick: int = 256) -> None:
        self._audit_log: List[AuditRecord] = []
        self._trace_coverage: Dict[str, float] = {f"L{i}": 100.0 for i in range(1, 10)}
        self._geometry_budget_per_tick = max(8, geometry_budget_per_tick)

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

    def evaluate_geometric_metric(
        self,
        baseline: Sequence[float],
        current: Sequence[float],
        *,
        tick_id: str,
    ) -> Dict[str, float | str | int]:
        """Compute a budget-aware geometric drift metric and audit the mode used."""
        if not baseline or not current:
            result: Dict[str, float | str | int] = {
                "tick_id": tick_id,
                "mode": "fallback_empty",
                "value": 0.0,
                "budget": self._geometry_budget_per_tick,
                "samples": 0,
            }
            self.append_audit_record("system", "geometric_metric", "IV", dict(result))
            return result

        budget = self._geometry_budget_per_tick
        max_samples = max(2, budget // 4)
        sample_count = min(len(baseline), len(current), max_samples)
        estimated_cost = (sample_count * 4) + len(baseline) + len(current)

        if estimated_cost <= budget:
            mode = "approx_wasserstein"
            value = self._approximate_wasserstein_1d(baseline, current, sample_count)
        else:
            mode = "fallback_mean_delta"
            value = abs(sum(current) / len(current) - sum(baseline) / len(baseline))

        result = {
            "tick_id": tick_id,
            "mode": mode,
            "value": round(value, 6),
            "budget": budget,
            "samples": sample_count,
        }
        self.append_audit_record("system", "geometric_metric", "IV", dict(result))
        return result

    def _approximate_wasserstein_1d(
        self,
        baseline: Sequence[float],
        current: Sequence[float],
        sample_count: int,
    ) -> float:
        baseline_sorted = sorted(float(v) for v in baseline)
        current_sorted = sorted(float(v) for v in current)
        if sample_count <= 1:
            return abs(baseline_sorted[0] - current_sorted[0])

        deltas: List[float] = []
        denominator = sample_count - 1
        for i in range(sample_count):
            quantile = i / denominator
            baseline_value = self._quantile_pick(baseline_sorted, quantile)
            current_value = self._quantile_pick(current_sorted, quantile)
            deltas.append(abs(current_value - baseline_value))
        return sum(deltas) / len(deltas)

    @staticmethod
    def _quantile_pick(values: Sequence[float], quantile: float) -> float:
        if len(values) == 1:
            return float(values[0])
        index = quantile * (len(values) - 1)
        lower = math.floor(index)
        upper = math.ceil(index)
        if lower == upper:
            return float(values[lower])
        blend = index - lower
        return (1.0 - blend) * float(values[lower]) + blend * float(values[upper])

    def should_trigger_rollback(self) -> bool:
        return any(v < 80.0 for v in self._trace_coverage.values())

    @property
    def audit_log(self) -> List[AuditRecord]:
        return list(self._audit_log)
