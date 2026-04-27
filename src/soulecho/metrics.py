from __future__ import annotations

import math
import random
from dataclasses import dataclass
from statistics import mean
from typing import Iterable, Sequence


_GAUSSIAN_Z_BY_CONFIDENCE = {
    0.80: 1.282,
    0.90: 1.645,
    0.95: 1.96,
    0.98: 2.326,
    0.99: 2.576,
}


@dataclass(frozen=True)
class SafetyMarginDiagnostics:
    error_model: str
    confidence_level: float
    sample_size: int
    min_required_samples: int
    std_estimate: float
    target_coverage: float
    empirical_coverage: float
    stale_model: bool
    failed_assumptions: list[str]


@dataclass(frozen=True)
class SafetyMarginResult:
    safety_margin: float
    lower_bound: float
    upper_bound: float
    diagnostics: SafetyMarginDiagnostics


def global_coherence(layer_scores: Iterable[float]) -> float:
    scores = list(layer_scores)
    if not scores:
        return 0.0
    return round(mean(scores), 2)


def anomaly_alerts(layer_scores: dict[str, float], threshold: float = 80.0) -> list[str]:
    return [f"{layer} deviated to {score}%" for layer, score in layer_scores.items() if score < threshold]


def probabilistic_safety_margin(
    values: Sequence[float],
    *,
    confidence_level: float = 0.95,
    error_model: str = "gaussian",
    min_samples: int | None = None,
    bootstrap_iterations: int = 500,
    random_seed: int = 7,
) -> SafetyMarginResult:
    if not values:
        raise ValueError("values must include at least one observation")
    if not 0 < confidence_level < 1:
        raise ValueError("confidence_level must be between 0 and 1")

    model = error_model.lower()
    if model not in {"gaussian", "empirical_quantile", "bootstrapped"}:
        raise ValueError("error_model must be gaussian, empirical_quantile, or bootstrapped")

    resolved_min_samples = min_samples if min_samples is not None else _default_min_samples(model, confidence_level)
    n = len(values)
    std = std_estimate(values)
    avg = mean(values)

    margin = _compute_margin(
        values,
        confidence_level=confidence_level,
        error_model=model,
        std=std,
        bootstrap_iterations=bootstrap_iterations,
        random_seed=random_seed,
    )
    lower, upper = avg - margin, avg + margin
    empirical_cov = empirical_coverage(values, lower=lower, upper=upper)
    assumption_failures = _validate_assumptions(
        values,
        model=model,
        std=std,
        min_samples=resolved_min_samples,
        target_coverage=confidence_level,
        empirical_coverage=empirical_cov,
    )

    diagnostics = SafetyMarginDiagnostics(
        error_model=model,
        confidence_level=confidence_level,
        sample_size=n,
        min_required_samples=resolved_min_samples,
        std_estimate=std,
        target_coverage=confidence_level,
        empirical_coverage=empirical_cov,
        stale_model=bool(assumption_failures),
        failed_assumptions=assumption_failures,
    )
    return SafetyMarginResult(safety_margin=margin, lower_bound=lower, upper_bound=upper, diagnostics=diagnostics)


def std_estimate(values: Sequence[float]) -> float:
    n = len(values)
    if n < 2:
        return 0.0
    avg = mean(values)
    sample_var = sum((value - avg) ** 2 for value in values) / (n - 1)
    return math.sqrt(sample_var)


def empirical_coverage(values: Sequence[float], *, lower: float, upper: float) -> float:
    if not values:
        return 0.0
    covered = sum(1 for value in values if lower <= value <= upper)
    return covered / len(values)


def _default_min_samples(model: str, confidence_level: float) -> int:
    if model == "gaussian":
        return 30
    if model == "bootstrapped":
        return 50
    # quantiles are sensitive in the tails at high confidence.
    return 40 if confidence_level >= 0.95 else 25


def _compute_margin(
    values: Sequence[float],
    *,
    confidence_level: float,
    error_model: str,
    std: float,
    bootstrap_iterations: int,
    random_seed: int,
) -> float:
    if error_model == "gaussian":
        z = _closest_supported_z(confidence_level)
        return z * std
    if error_model == "empirical_quantile":
        sorted_values = sorted(values)
        alpha = (1.0 - confidence_level) / 2.0
        lower_q = _quantile(sorted_values, alpha)
        upper_q = _quantile(sorted_values, 1.0 - alpha)
        return max(abs(mean(values) - lower_q), abs(upper_q - mean(values)))

    rng = random.Random(random_seed)
    boot_means = []
    for _ in range(bootstrap_iterations):
        sample = [values[rng.randrange(0, len(values))] for _ in values]
        boot_means.append(mean(sample))
    sorted_boot = sorted(boot_means)
    alpha = (1.0 - confidence_level) / 2.0
    lower_q = _quantile(sorted_boot, alpha)
    upper_q = _quantile(sorted_boot, 1.0 - alpha)
    return max(abs(mean(values) - lower_q), abs(upper_q - mean(values)))


def _closest_supported_z(confidence_level: float) -> float:
    return _GAUSSIAN_Z_BY_CONFIDENCE[min(_GAUSSIAN_Z_BY_CONFIDENCE, key=lambda c: abs(c - confidence_level))]


def _quantile(sorted_values: Sequence[float], q: float) -> float:
    if q <= 0:
        return sorted_values[0]
    if q >= 1:
        return sorted_values[-1]
    idx = q * (len(sorted_values) - 1)
    lower = math.floor(idx)
    upper = math.ceil(idx)
    if lower == upper:
        return sorted_values[lower]
    fraction = idx - lower
    return sorted_values[lower] + (sorted_values[upper] - sorted_values[lower]) * fraction


def _validate_assumptions(
    values: Sequence[float],
    *,
    model: str,
    std: float,
    min_samples: int,
    target_coverage: float,
    empirical_coverage: float,
) -> list[str]:
    failures: list[str] = []
    if len(values) < min_samples:
        failures.append(f"sample_size<{min_samples}")
    if std == 0:
        failures.append("std_estimate==0")
    if empirical_coverage + 0.05 < target_coverage:
        failures.append("coverage_below_target")
    if model == "gaussian":
        outliers = _count_sigma_outliers(values, sigma=3.0)
        if outliers > max(1, len(values) // 20):
            failures.append("gaussian_tail_heaviness")
    return failures


def _count_sigma_outliers(values: Sequence[float], sigma: float) -> int:
    avg = mean(values)
    std = std_estimate(values)
    if std == 0:
        return 0
    limit = sigma * std
    return sum(1 for value in values if abs(value - avg) > limit)
