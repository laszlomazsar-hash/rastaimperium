from __future__ import annotations

import math
import random
from dataclasses import dataclass
from typing import Callable, List, Sequence, Tuple

StateVector = Tuple[float, ...]


@dataclass(frozen=True)
class FormalMeasure:
    """Finite discrete measure with weighted support points."""

    support: List[StateVector]
    mass: List[float]


@dataclass
class RuntimeParticleSet:
    """Executable runtime representation used by inference/update loops."""

    particles: List[StateVector]
    weights: List[float]


@dataclass(frozen=True)
class ApproximationBounds:
    """Acceptance thresholds for production gating."""

    max_total_variation: float = 0.05
    min_effective_sample_ratio: float = 0.50


class MeasureRuntimeBridge:
    """
    Bridge between a formal measure model and runtime particle execution.

    Representation choice: weighted particle set.
    """

    def __init__(self, particle_count: int = 256, ess_resample_ratio: float = 0.5) -> None:
        if particle_count <= 0:
            raise ValueError("particle_count must be positive")
        self.particle_count = particle_count
        self.ess_resample_ratio = ess_resample_ratio
        self.bounds = ApproximationBounds(min_effective_sample_ratio=ess_resample_ratio)

    def project_formal_to_runtime(self, measure: FormalMeasure, seed: int | None = None) -> RuntimeParticleSet:
        self._validate_measure(measure)
        rng = random.Random(seed)
        normalized_mass = self._normalize_weights(measure.mass)
        particles = rng.choices(measure.support, weights=normalized_mass, k=self.particle_count)
        weights = [1.0 / self.particle_count] * self.particle_count
        return RuntimeParticleSet(particles=particles, weights=weights)

    def project_runtime_to_formal(self, particle_set: RuntimeParticleSet) -> FormalMeasure:
        self._validate_particle_set(particle_set)
        normalized_weights = self._normalize_weights(particle_set.weights)
        aggregate: dict[StateVector, float] = {}
        for particle, weight in zip(particle_set.particles, normalized_weights):
            aggregate[particle] = aggregate.get(particle, 0.0) + weight
        support = list(aggregate.keys())
        mass = [aggregate[s] for s in support]
        return FormalMeasure(support=support, mass=mass)

    def normalize(self, particle_set: RuntimeParticleSet) -> RuntimeParticleSet:
        self._validate_particle_set(particle_set)
        particle_set.weights = self._normalize_weights(particle_set.weights)
        return particle_set

    def update(
        self,
        particle_set: RuntimeParticleSet,
        likelihood: Callable[[StateVector], float],
        seed: int | None = None,
    ) -> RuntimeParticleSet:
        self._validate_particle_set(particle_set)
        rng = random.Random(seed)

        updated_weights: List[float] = []
        for particle, weight in zip(particle_set.particles, particle_set.weights):
            score = max(0.0, likelihood(particle))
            updated_weights.append(weight * score)

        particle_set.weights = self._normalize_weights(updated_weights)
        if self.effective_sample_size(particle_set) < self.ess_resample_ratio * len(particle_set.particles):
            self._systematic_resample(particle_set, rng)
        return particle_set

    def effective_sample_size(self, particle_set: RuntimeParticleSet) -> float:
        self._validate_particle_set(particle_set)
        normalized = self._normalize_weights(particle_set.weights)
        return 1.0 / sum(w * w for w in normalized)

    def approximation_error(self, baseline: FormalMeasure, reconstructed: FormalMeasure) -> float:
        """Total variation distance over shared finite support."""
        self._validate_measure(baseline)
        self._validate_measure(reconstructed)

        baseline_map = self._measure_as_map(baseline)
        recon_map = self._measure_as_map(reconstructed)
        support = set(baseline_map) | set(recon_map)

        l1 = sum(abs(baseline_map.get(s, 0.0) - recon_map.get(s, 0.0)) for s in support)
        return 0.5 * l1

    def within_acceptance_bounds(self, error: float, particle_set: RuntimeParticleSet) -> bool:
        ess_ratio = self.effective_sample_size(particle_set) / len(particle_set.particles)
        return error <= self.bounds.max_total_variation and ess_ratio >= self.bounds.min_effective_sample_ratio

    def _systematic_resample(self, particle_set: RuntimeParticleSet, rng: random.Random) -> None:
        count = len(particle_set.particles)
        cumulative = []
        total = 0.0
        for weight in self._normalize_weights(particle_set.weights):
            total += weight
            cumulative.append(total)

        start = rng.random() / count
        indexes: List[int] = []
        i = 0
        for m in range(count):
            u = start + m / count
            while i < count - 1 and u > cumulative[i]:
                i += 1
            indexes.append(i)

        particle_set.particles = [particle_set.particles[i] for i in indexes]
        particle_set.weights = [1.0 / count] * count

    @staticmethod
    def _normalize_weights(weights: Sequence[float]) -> List[float]:
        total = sum(max(0.0, w) for w in weights)
        if math.isclose(total, 0.0):
            raise ValueError("weights must contain at least one positive value")
        return [max(0.0, w) / total for w in weights]

    @staticmethod
    def _validate_measure(measure: FormalMeasure) -> None:
        if len(measure.support) == 0:
            raise ValueError("measure support cannot be empty")
        if len(measure.support) != len(measure.mass):
            raise ValueError("support and mass lengths must match")

    @staticmethod
    def _validate_particle_set(particle_set: RuntimeParticleSet) -> None:
        if len(particle_set.particles) == 0:
            raise ValueError("particle set cannot be empty")
        if len(particle_set.particles) != len(particle_set.weights):
            raise ValueError("particle and weight lengths must match")

    @staticmethod
    def _measure_as_map(measure: FormalMeasure) -> dict[StateVector, float]:
        normalized = MeasureRuntimeBridge._normalize_weights(measure.mass)
        output: dict[StateVector, float] = {}
        for state, mass in zip(measure.support, normalized):
            output[state] = output.get(state, 0.0) + mass
        return output
