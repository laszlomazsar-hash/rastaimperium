from __future__ import annotations

import hashlib
import json
import math
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Dict, List, Literal


LikelihoodForm = Literal["gaussian", "bernoulli"]


@dataclass
class AuditRecord:
    actor: str
    action: str
    article: str
    metadata: Dict[str, object]
    timestamp: str
    digest: str


@dataclass
class LikelihoodSpecification:
    regime: str
    model_class: str
    likelihood_form: LikelihoodForm
    noise_model: str
    parameter_bounds: Dict[str, tuple[float, float]] = field(default_factory=dict)


@dataclass
class CalibrationBin:
    bin_start: float
    bin_end: float
    predicted_mean: float
    observed_frequency: float
    absolute_error: float
    sample_count: int


class ComplianceEngine:
    """Article II-IV observability + audit logging + rollback triggers."""

    def __init__(self) -> None:
        self._audit_log: List[AuditRecord] = []
        self._trace_coverage: Dict[str, float] = {f"L{i}": 100.0 for i in range(1, 10)}
        self._likelihood_specs: Dict[str, LikelihoodSpecification] = {}
        self._calibration_results: Dict[str, dict[str, object]] = {}

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

    def register_likelihood(
        self,
        regime: str,
        model_class: str,
        likelihood_form: LikelihoodForm,
        noise_model: str,
        parameter_bounds: Dict[str, tuple[float, float]] | None = None,
    ) -> LikelihoodSpecification:
        bounds = parameter_bounds or {}
        for name, (low, high) in bounds.items():
            if low > high:
                raise ValueError(f"Invalid bounds for {name}: low must be <= high")

        spec = LikelihoodSpecification(
            regime=regime,
            model_class=model_class,
            likelihood_form=likelihood_form,
            noise_model=noise_model,
            parameter_bounds=bounds,
        )
        self._likelihood_specs[regime] = spec
        return spec

    def calibrate_regime(
        self,
        regime: str,
        predicted_probabilities: List[float],
        observed_outcomes: List[float],
        bins: int = 10,
    ) -> dict[str, object]:
        if regime not in self._likelihood_specs:
            raise KeyError(f"No likelihood specification registered for regime '{regime}'")
        if len(predicted_probabilities) != len(observed_outcomes):
            raise ValueError("predicted_probabilities and observed_outcomes must have equal length")
        if not predicted_probabilities:
            raise ValueError("calibration requires at least one sample")

        clipped_predictions = [min(1.0, max(0.0, value)) for value in predicted_probabilities]
        clipped_observed = [min(1.0, max(0.0, value)) for value in observed_outcomes]

        reliability_curve: List[CalibrationBin] = []
        step = 1.0 / bins
        for index in range(bins):
            low = round(index * step, 10)
            high = round((index + 1) * step, 10)
            bin_pairs = [
                (prediction, outcome)
                for prediction, outcome in zip(clipped_predictions, clipped_observed)
                if low <= prediction < high or (index == bins - 1 and prediction == 1.0)
            ]
            if not bin_pairs:
                continue

            predicted_mean = sum(pred for pred, _ in bin_pairs) / len(bin_pairs)
            observed_frequency = sum(obs for _, obs in bin_pairs) / len(bin_pairs)
            reliability_curve.append(
                CalibrationBin(
                    bin_start=low,
                    bin_end=high,
                    predicted_mean=round(predicted_mean, 6),
                    observed_frequency=round(observed_frequency, 6),
                    absolute_error=round(abs(predicted_mean - observed_frequency), 6),
                    sample_count=len(bin_pairs),
                )
            )

        mae = sum(abs(p - o) for p, o in zip(clipped_predictions, clipped_observed)) / len(clipped_predictions)
        brier = sum((p - o) ** 2 for p, o in zip(clipped_predictions, clipped_observed)) / len(clipped_predictions)

        diagnostics = {
            "regime": regime,
            "sample_size": len(clipped_predictions),
            "mean_absolute_error": round(mae, 6),
            "brier_score": round(brier, 6),
            "reliability_curve": [vars(point) for point in reliability_curve],
            "error_curve": [
                {
                    "index": index,
                    "predicted": round(prediction, 6),
                    "observed": round(observed, 6),
                    "absolute_error": round(abs(prediction - observed), 6),
                }
                for index, (prediction, observed) in enumerate(zip(clipped_predictions, clipped_observed))
            ],
            "nll": round(self._negative_log_likelihood(regime, clipped_predictions, clipped_observed), 6),
            "calibrated_at": datetime.now(timezone.utc).isoformat(),
        }
        self._calibration_results[regime] = diagnostics
        return diagnostics

    def _negative_log_likelihood(self, regime: str, predictions: List[float], observations: List[float]) -> float:
        spec = self._likelihood_specs[regime]
        eps = 1e-9

        if spec.likelihood_form == "bernoulli":
            total = 0.0
            for probability, outcome in zip(predictions, observations):
                p = min(1.0 - eps, max(eps, probability))
                total -= outcome * math.log(p) + (1.0 - outcome) * math.log(1.0 - p)
            return total

        # Gaussian likelihood over bounded [0, 1] responses
        sigma_low, sigma_high = spec.parameter_bounds.get("sigma", (0.01, 1.0))
        sigma = max(sigma_low, min(sigma_high, 0.1))
        variance = sigma * sigma
        normalizer = 0.5 * math.log(2.0 * math.pi * variance)
        return sum(normalizer + ((obs - pred) ** 2) / (2.0 * variance) for pred, obs in zip(predictions, observations))

    def likelihood_diagnostics(self) -> dict[str, object]:
        return {
            "specifications": {regime: vars(spec) for regime, spec in self._likelihood_specs.items()},
            "calibration": self._calibration_results,
        }

    def trace_coverage_graph(self) -> List[Dict[str, float]]:
        return [{"layer": layer, "coverage": value} for layer, value in sorted(self._trace_coverage.items())]

    def should_trigger_rollback(self) -> bool:
        return any(v < 80.0 for v in self._trace_coverage.values())

    @property
    def audit_log(self) -> List[AuditRecord]:
        return list(self._audit_log)
