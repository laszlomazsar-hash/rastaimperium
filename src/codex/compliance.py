from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Callable, Dict, List, Optional


@dataclass(frozen=True)
class ProbeStepPolicy:
    """Deterministic finite-difference step-size policy."""

    base_h: float = 1e-4
    scale: float = 1.0
    min_h: float = 1e-6
    max_h: float = 1e-2

    def compute_h(self, x: float) -> float:
        scaled = self.base_h * max(1.0, abs(x)) * self.scale
        return max(self.min_h, min(self.max_h, scaled))


@dataclass(frozen=True)
class ProbeConfig:
    """Versioned probe configuration for certified policy profiles."""

    version: str
    scheme: str
    step_policy: ProbeStepPolicy


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
        probe_config = ProbeConfig(
            version="subgradient_probe/v1",
            scheme="central",
            step_policy=ProbeStepPolicy(base_h=1e-4, scale=1.0, min_h=1e-6, max_h=1e-2),
        )
        self._certified_profiles: Dict[str, ProbeConfig] = {
            "strict": probe_config,
            "balanced": probe_config,
            "recovery": probe_config,
        }

    def append_audit_record(
        self,
        actor: str,
        action: str,
        article: str,
        metadata: Dict[str, object],
        policy_profile: Optional[str] = None,
    ) -> AuditRecord:
        timestamp = datetime.now(timezone.utc).isoformat()
        metadata_copy = dict(metadata)
        if policy_profile is not None:
            metadata_copy["policy_profile"] = policy_profile
            metadata_copy["probe_config"] = self.probe_config_artifact(policy_profile)
        payload = {
            "actor": actor,
            "action": action,
            "article": article,
            "metadata": metadata_copy,
            "timestamp": timestamp,
        }
        digest = hashlib.sha256(json.dumps(payload, sort_keys=True).encode("utf-8")).hexdigest()
        record = AuditRecord(**payload, digest=digest)
        self._audit_log.append(record)
        return record

    def probe_config_artifact(self, profile: str) -> Dict[str, object]:
        config = self._certified_profiles[profile]
        return {
            "version": config.version,
            "scheme": config.scheme,
            "h_policy": {
                "base_h": config.step_policy.base_h,
                "scale": config.step_policy.scale,
                "min_h": config.step_policy.min_h,
                "max_h": config.step_policy.max_h,
            },
        }

    def approximate_subgradient(
        self,
        fn: Callable[[float], float],
        x: float,
        profile: str = "strict",
        *,
        lower_bound: Optional[float] = None,
        upper_bound: Optional[float] = None,
    ) -> float:
        config = self._certified_profiles[profile]
        h = config.step_policy.compute_h(x)

        left_ok = lower_bound is None or (x - h) >= lower_bound
        right_ok = upper_bound is None or (x + h) <= upper_bound

        if config.scheme == "central" and left_ok and right_ok:
            return (fn(x + h) - fn(x - h)) / (2.0 * h)
        if right_ok:
            return (fn(x + h) - fn(x)) / h
        if left_ok:
            return (fn(x) - fn(x - h)) / h
        return 0.0

    def set_trace_coverage(self, layer: str, coverage: float) -> None:
        self._trace_coverage[layer] = max(0.0, min(100.0, coverage))

    def trace_coverage_graph(self) -> List[Dict[str, float]]:
        return [{"layer": layer, "coverage": value} for layer, value in sorted(self._trace_coverage.items())]

    def should_trigger_rollback(self) -> bool:
        return any(v < 80.0 for v in self._trace_coverage.values())

    @property
    def audit_log(self) -> List[AuditRecord]:
        return list(self._audit_log)
