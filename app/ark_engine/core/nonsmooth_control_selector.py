"""Finite and certifiable selector for nonsmooth control decisions."""

from __future__ import annotations

from dataclasses import dataclass
import hashlib
import json
import math
from typing import Iterable, List, Sequence


@dataclass(frozen=True)
class CandidateVector:
    """A finite candidate element used by the selector."""

    vector: tuple[float, ...]
    source: str
    source_index: int

    @property
    def squared_norm(self) -> float:
        return sum(component * component for component in self.vector)


@dataclass(frozen=True)
class SelectorCertificate:
    """Certificate artifact for replay and safety review."""

    ordered_candidates: tuple[CandidateVector, ...]
    chosen_index: int
    chosen_vector: tuple[float, ...]
    candidate_set_size: int
    approximation_error_bound: float
    replay_digest: str


class NonsmoothControlSelector:
    """Implements a deterministic finite approximation to Clarke minimum-norm selection."""

    SOURCE_PRIORITY = {"active_face": 0, "directional": 1, "convex_hull": 2}

    def __init__(
        self,
        *,
        active_tolerance: float = 1e-6,
        directional_gap_bound: float = 0.0,
        convex_hull_gap_bound: float = 0.0,
        rounding_decimals: int = 12,
    ) -> None:
        self.active_tolerance = max(0.0, active_tolerance)
        self.directional_gap_bound = max(0.0, directional_gap_bound)
        self.convex_hull_gap_bound = max(0.0, convex_hull_gap_bound)
        self.rounding_decimals = max(1, rounding_decimals)

    def select(
        self,
        *,
        active_face_values: Sequence[float],
        active_face_gradients: Sequence[Sequence[float]],
        directional_samples: Sequence[tuple[Sequence[float], float]] = (),
        local_model_vertices: Sequence[Sequence[float]] = (),
    ) -> SelectorCertificate:
        """
        Select a deterministic control proxy for Clarke minimum-norm subgradients.

        Candidate generation is finite and consists of:
        1) active-face gradients;
        2) sampled directional-derivative induced vectors; and
        3) local-model convex hull vertices.
        """
        candidates = self._generate_candidates(
            active_face_values=active_face_values,
            active_face_gradients=active_face_gradients,
            directional_samples=directional_samples,
            local_model_vertices=local_model_vertices,
        )
        if not candidates:
            raise ValueError("No candidates generated for nonsmooth control selection.")

        ordered_candidates = tuple(self._deterministic_order(candidates))
        chosen_index = 0
        chosen_vector = ordered_candidates[chosen_index].vector
        approximation_error_bound = self._approximation_error_bound(active_face_values)
        replay_digest = self._build_replay_digest(ordered_candidates, chosen_index)

        return SelectorCertificate(
            ordered_candidates=ordered_candidates,
            chosen_index=chosen_index,
            chosen_vector=chosen_vector,
            candidate_set_size=len(ordered_candidates),
            approximation_error_bound=approximation_error_bound,
            replay_digest=replay_digest,
        )

    def _generate_candidates(
        self,
        *,
        active_face_values: Sequence[float],
        active_face_gradients: Sequence[Sequence[float]],
        directional_samples: Sequence[tuple[Sequence[float], float]],
        local_model_vertices: Sequence[Sequence[float]],
    ) -> List[CandidateVector]:
        self._validate_inputs(active_face_values, active_face_gradients)

        raw_candidates: list[CandidateVector] = []

        min_value = min(active_face_values)
        threshold = min_value + self.active_tolerance
        for index, (value, gradient) in enumerate(zip(active_face_values, active_face_gradients)):
            if value <= threshold:
                raw_candidates.append(
                    CandidateVector(
                        vector=self._normalized_tuple(gradient),
                        source="active_face",
                        source_index=index,
                    )
                )

        for index, (direction, derivative) in enumerate(directional_samples):
            direction_tuple = self._normalized_tuple(direction)
            direction_norm = math.sqrt(sum(component * component for component in direction_tuple))
            if direction_norm == 0.0:
                continue
            unit_direction = tuple(component / direction_norm for component in direction_tuple)
            induced_vector = tuple(derivative * component for component in unit_direction)
            raw_candidates.append(
                CandidateVector(
                    vector=self._normalized_tuple(induced_vector),
                    source="directional",
                    source_index=index,
                )
            )

        for index, vertex in enumerate(local_model_vertices):
            raw_candidates.append(
                CandidateVector(
                    vector=self._normalized_tuple(vertex),
                    source="convex_hull",
                    source_index=index,
                )
            )

        return self._deduplicate(raw_candidates)

    def _deterministic_order(self, candidates: Iterable[CandidateVector]) -> list[CandidateVector]:
        return sorted(
            candidates,
            key=lambda candidate: (
                candidate.squared_norm,
                candidate.vector,
                self.SOURCE_PRIORITY.get(candidate.source, 99),
                candidate.source_index,
            ),
        )

    def _approximation_error_bound(self, active_face_values: Sequence[float]) -> float:
        if not active_face_values:
            return 0.0
        active_face_gap = self.active_tolerance
        return max(active_face_gap, self.directional_gap_bound, self.convex_hull_gap_bound)

    def _build_replay_digest(self, ordered_candidates: tuple[CandidateVector, ...], chosen_index: int) -> str:
        payload = {
            "ordered_candidates": [
                {
                    "vector": candidate.vector,
                    "source": candidate.source,
                    "source_index": candidate.source_index,
                }
                for candidate in ordered_candidates
            ],
            "chosen_index": chosen_index,
            "candidate_set_size": len(ordered_candidates),
        }
        encoded = json.dumps(payload, sort_keys=True, separators=(",", ":")).encode("utf-8")
        return hashlib.sha256(encoded).hexdigest()

    def _deduplicate(self, candidates: Iterable[CandidateVector]) -> list[CandidateVector]:
        seen: dict[tuple[float, ...], CandidateVector] = {}
        for candidate in candidates:
            if candidate.vector not in seen:
                seen[candidate.vector] = candidate
        return list(seen.values())

    def _normalized_tuple(self, vector: Sequence[float]) -> tuple[float, ...]:
        return tuple(round(float(component), self.rounding_decimals) for component in vector)

    def _validate_inputs(
        self,
        active_face_values: Sequence[float],
        active_face_gradients: Sequence[Sequence[float]],
    ) -> None:
        if not active_face_values or not active_face_gradients:
            raise ValueError("Active-face values and gradients are required.")
        if len(active_face_values) != len(active_face_gradients):
            raise ValueError("active_face_values and active_face_gradients length mismatch.")
        gradient_width = len(active_face_gradients[0])
        if gradient_width == 0:
            raise ValueError("Active-face gradients must have non-zero dimension.")
        for gradient in active_face_gradients:
            if len(gradient) != gradient_width:
                raise ValueError("All active-face gradients must share the same dimension.")
