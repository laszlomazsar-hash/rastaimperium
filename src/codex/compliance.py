from __future__ import annotations

import hashlib
import json
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

    def __init__(self, *, override_cooldown_ticks: int = 2, override_min_hold_ticks: int = 3) -> None:
        self._audit_log: List[AuditRecord] = []
        self._trace_coverage: Dict[str, float] = {f"L{i}": 100.0 for i in range(1, 10)}
        self._override_active = False
        self._override_history: List[Dict[str, object]] = []
        self._override_tick = 0
        self._last_transition_tick = -10**9
        self._override_engaged_tick: int | None = None
        self._override_cooldown_ticks = max(0, override_cooldown_ticks)
        self._override_min_hold_ticks = max(0, override_min_hold_ticks)

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

    @staticmethod
    def _bound_metric(value: float, *, lower: float, upper: float) -> float:
        return max(lower, min(upper, value))

    def _evaluate_emergency_predicates(self, metrics: Dict[str, float]) -> Dict[str, bool]:
        min_trace_coverage = self._bound_metric(metrics.get("min_trace_coverage", 100.0), lower=0.0, upper=100.0)
        error_rate_pct = self._bound_metric(metrics.get("error_rate_pct", 0.0), lower=0.0, upper=100.0)
        p95_latency_ms = self._bound_metric(metrics.get("p95_latency_ms", 0.0), lower=0.0, upper=60_000.0)

        return {
            "trace_coverage_breach": min_trace_coverage < 80.0,
            "error_rate_breach": error_rate_pct > 5.0,
            "latency_breach": p95_latency_ms > 2_500.0,
        }

    def evaluate_override_state(self, metrics: Dict[str, float], manual_override: str | None = None) -> bool:
        """
        Evaluate emergency rollback override with anti-toggle controls.

        manual_override values:
          - ``force_on``: force emergency override on
          - ``force_off``: force emergency override off
          - None: rely on predicate evaluation
        """
        self._override_tick += 1

        bounded_inputs = {
            "min_trace_coverage": self._bound_metric(metrics.get("min_trace_coverage", 100.0), lower=0.0, upper=100.0),
            "error_rate_pct": self._bound_metric(metrics.get("error_rate_pct", 0.0), lower=0.0, upper=100.0),
            "p95_latency_ms": self._bound_metric(metrics.get("p95_latency_ms", 0.0), lower=0.0, upper=60_000.0),
        }
        predicates = self._evaluate_emergency_predicates(bounded_inputs)
        predicate_triggered = any(predicates.values())

        reason_code = "PREDICATE_CLEAR"
        desired_state = predicate_triggered
        if manual_override == "force_on":
            desired_state = True
            reason_code = "MANUAL_FORCE_ON"
        elif manual_override == "force_off":
            desired_state = False
            reason_code = "MANUAL_FORCE_OFF"
        elif predicate_triggered:
            reason_code = "PREDICATE_TRIGGERED"

        elapsed_from_transition = self._override_tick - self._last_transition_tick
        transitioned = False
        if desired_state != self._override_active:
            if elapsed_from_transition < self._override_cooldown_ticks:
                reason_code = "COOLDOWN_SUPPRESSED"
            elif self._override_active and desired_state is False:
                held_ticks = self._override_tick - (self._override_engaged_tick or self._override_tick)
                if held_ticks < self._override_min_hold_ticks:
                    reason_code = "MIN_HOLD_SUPPRESSED"
                else:
                    self._override_active = False
                    self._last_transition_tick = self._override_tick
                    transitioned = True
                    reason_code = f"{reason_code}_APPLIED"
            else:
                self._override_active = desired_state
                self._last_transition_tick = self._override_tick
                transitioned = True
                if self._override_active:
                    self._override_engaged_tick = self._override_tick
                else:
                    self._override_engaged_tick = None
                reason_code = f"{reason_code}_APPLIED"

        self._override_history.append(
            {
                "tick": self._override_tick,
                "override_active": self._override_active,
                "manual_override": manual_override,
                "reason_code": reason_code,
                "transitioned": transitioned,
                "predicate_inputs": bounded_inputs,
                "predicates": predicates,
            }
        )
        return self._override_active

    def should_trigger_rollback(self) -> bool:
        return self.evaluate_override_state(
            metrics={
                "min_trace_coverage": min(self._trace_coverage.values(), default=100.0),
                "error_rate_pct": 0.0,
                "p95_latency_ms": 0.0,
            }
        )

    @property
    def audit_log(self) -> List[AuditRecord]:
        return list(self._audit_log)

    @property
    def override_history(self) -> List[Dict[str, object]]:
        return list(self._override_history)
