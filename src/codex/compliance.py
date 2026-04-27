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


@dataclass
class CalibrationMetadata:
    threshold_version: str
    calibrated_at: str
    dataset_scope: str
    baseline_window: str
    policy_limit: float
    latest_residual_drift: float
    recalibration_required: bool


class ComplianceEngine:
    """Article II-IV observability + audit logging + rollback triggers."""

    def __init__(self) -> None:
        self._audit_log: List[AuditRecord] = []
        self._trace_coverage: Dict[str, float] = {f"L{i}": 100.0 for i in range(1, 10)}
        self._calibration_counter = 0
        self._proxy_threshold_metadata = self._build_calibration_metadata(
            dataset_scope="rolling:initial",
            baseline_window="30d",
            policy_limit=0.1,
            latest_residual_drift=0.0,
            recalibration_required=False,
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
        record = AuditRecord(**payload, digest=digest)
        self._audit_log.append(record)
        return record

    def set_trace_coverage(self, layer: str, coverage: float) -> None:
        self._trace_coverage[layer] = max(0.0, min(100.0, coverage))

    def trace_coverage_graph(self) -> List[Dict[str, float]]:
        return [{"layer": layer, "coverage": value} for layer, value in sorted(self._trace_coverage.items())]

    def should_trigger_rollback(self) -> bool:
        return any(v < 80.0 for v in self._trace_coverage.values())

    def calibrate_proxy_thresholds(self, dataset_scope: str, baseline_window: str, policy_limit: float) -> CalibrationMetadata:
        self._proxy_threshold_metadata = self._build_calibration_metadata(
            dataset_scope=dataset_scope,
            baseline_window=baseline_window,
            policy_limit=policy_limit,
            latest_residual_drift=0.0,
            recalibration_required=False,
        )
        return self._proxy_threshold_metadata

    def evaluate_proxy_residual_drift(self, residual_drift: float) -> bool:
        limit = self._proxy_threshold_metadata.policy_limit
        recalibration_required = residual_drift > limit
        self._proxy_threshold_metadata.latest_residual_drift = residual_drift
        self._proxy_threshold_metadata.recalibration_required = recalibration_required
        return recalibration_required

    def calibration_status(self) -> Dict[str, object]:
        metadata = self._proxy_threshold_metadata
        return {
            "threshold_version": metadata.threshold_version,
            "calibrated_at": metadata.calibrated_at,
            "dataset_scope": metadata.dataset_scope,
            "baseline_window": metadata.baseline_window,
            "policy_limit": metadata.policy_limit,
            "latest_residual_drift": metadata.latest_residual_drift,
            "recalibration_required": metadata.recalibration_required,
        }

    def _build_calibration_metadata(
        self,
        dataset_scope: str,
        baseline_window: str,
        policy_limit: float,
        latest_residual_drift: float,
        recalibration_required: bool,
    ) -> CalibrationMetadata:
        self._calibration_counter += 1
        return CalibrationMetadata(
            threshold_version=f"proxy-v{self._calibration_counter}",
            calibrated_at=datetime.now(timezone.utc).isoformat(),
            dataset_scope=dataset_scope,
            baseline_window=baseline_window,
            policy_limit=policy_limit,
            latest_residual_drift=latest_residual_drift,
            recalibration_required=recalibration_required,
        )

    @property
    def audit_log(self) -> List[AuditRecord]:
        return list(self._audit_log)
