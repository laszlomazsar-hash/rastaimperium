from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone
from math import floor
from typing import Iterable, Literal

CalibrationMethod = Literal["platt_scaling", "isotonic_regression", "empirical_reliability_bins"]
CalibrationStatus = Literal["healthy", "insufficient_data", "recalibration_required", "needs_calibration"]


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


@dataclass
class CalibrationDatasetScope:
    name: str
    update_cadence: str
    sample_count: int
    observed_at: str


@dataclass
class AsymptoticLabelCalibrator:
    """Empirical reliability-bin calibrator with drift monitoring policy."""

    method: CalibrationMethod = "empirical_reliability_bins"
    bin_count: int = 10
    min_observations: int = 50
    target_ece: float = 0.05
    drift_delta_threshold: float = 0.03
    max_staleness_days: int = 14
    calibrated_at: str | None = None
    baseline_ece: float | None = None
    current_ece: float | None = None
    status: CalibrationStatus = "needs_calibration"
    dataset_scope: CalibrationDatasetScope | None = None
    _bin_accuracy: list[float] = field(default_factory=list)
    _trigger_reason: str | None = None

    def fit(
        self,
        probabilities: Iterable[float],
        labels: Iterable[int],
        *,
        dataset_scope: str,
        update_cadence: str,
    ) -> dict[str, object]:
        paired = self._paired(probabilities, labels)
        if len(paired) < self.min_observations:
            self.status = "insufficient_data"
            self._trigger_reason = "insufficient_calibration_samples"
            return self.observability_payload()

        self._bin_accuracy = self._derive_bin_accuracy(paired)
        calibrated_pairs = [(self._calibrate_score(score), label) for score, label in paired]
        self.baseline_ece = self._ece(calibrated_pairs)
        self.current_ece = self.baseline_ece
        self.calibrated_at = _utc_now().isoformat()
        self.status = "healthy"
        self._trigger_reason = None
        self.dataset_scope = CalibrationDatasetScope(
            name=dataset_scope,
            update_cadence=update_cadence,
            sample_count=len(paired),
            observed_at=self.calibrated_at,
        )
        return self.observability_payload()

    def monitor_drift(self, probabilities: Iterable[float], labels: Iterable[int]) -> dict[str, object]:
        if self.baseline_ece is None or self.calibrated_at is None:
            self.status = "needs_calibration"
            self._trigger_reason = "not_calibrated"
            return self.observability_payload()

        paired = self._paired(probabilities, labels)
        if len(paired) < self.min_observations:
            self.status = "insufficient_data"
            self._trigger_reason = "insufficient_monitoring_samples"
            return self.observability_payload()

        calibrated_pairs = [(self._calibrate_score(score), label) for score, label in paired]
        self.current_ece = self._ece(calibrated_pairs)
        calibration_time = datetime.fromisoformat(self.calibrated_at)
        is_stale = _utc_now() - calibration_time > timedelta(days=self.max_staleness_days)
        drift_delta = self.current_ece - self.baseline_ece

        if is_stale or drift_delta > self.drift_delta_threshold or self.current_ece > self.target_ece:
            self.status = "recalibration_required"
            reasons = []
            if is_stale:
                reasons.append("stale_calibration")
            if drift_delta > self.drift_delta_threshold:
                reasons.append("ece_drift")
            if self.current_ece > self.target_ece:
                reasons.append("ece_above_target")
            self._trigger_reason = ",".join(reasons)
        else:
            self.status = "healthy"
            self._trigger_reason = None

        return self.observability_payload()

    def observability_payload(self) -> dict[str, object]:
        payload: dict[str, object] = {
            "method": self.method,
            "calibrated_at": self.calibrated_at,
            "ece": None if self.current_ece is None else round(self.current_ece, 6),
            "status": self.status,
        }
        if self.dataset_scope is not None:
            payload["dataset_scope"] = {
                "name": self.dataset_scope.name,
                "update_cadence": self.dataset_scope.update_cadence,
                "sample_count": self.dataset_scope.sample_count,
                "observed_at": self.dataset_scope.observed_at,
            }
        if self._trigger_reason:
            payload["recalibration_trigger"] = self._trigger_reason
        return payload

    def _paired(self, probabilities: Iterable[float], labels: Iterable[int]) -> list[tuple[float, int]]:
        return [(max(0.0, min(1.0, float(p))), int(y)) for p, y in zip(probabilities, labels, strict=False)]

    def _derive_bin_accuracy(self, paired: list[tuple[float, int]]) -> list[float]:
        bins: list[list[int]] = [[] for _ in range(self.bin_count)]
        for probability, label in paired:
            bins[self._bin_index(probability)].append(label)
        return [(sum(bin_labels) / len(bin_labels)) if bin_labels else 0.5 for bin_labels in bins]

    def _calibrate_score(self, score: float) -> float:
        if not self._bin_accuracy:
            return score
        return self._bin_accuracy[self._bin_index(score)]

    def _bin_index(self, value: float) -> int:
        return min(self.bin_count - 1, floor(value * self.bin_count))

    def _ece(self, paired: list[tuple[float, int]]) -> float:
        if not paired:
            return 0.0

        total = len(paired)
        bins: list[list[tuple[float, int]]] = [[] for _ in range(self.bin_count)]
        for confidence, label in paired:
            bins[self._bin_index(confidence)].append((confidence, label))

        ece = 0.0
        for bin_items in bins:
            if not bin_items:
                continue
            bin_weight = len(bin_items) / total
            avg_conf = sum(item[0] for item in bin_items) / len(bin_items)
            avg_acc = sum(item[1] for item in bin_items) / len(bin_items)
            ece += bin_weight * abs(avg_conf - avg_acc)
        return ece
