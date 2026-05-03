from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Dict, List, Mapping, Sequence


@dataclass(frozen=True)
class DeterministicExecutionProfile:
    """Approved deterministic execution settings for reproducible runs."""

    name: str
    library_versions: Mapping[str, str]
    thread_counts: Mapping[str, int]
    deterministic_flags: Mapping[str, bool]

    def hash(self) -> str:
        payload = {
            "name": self.name,
            "library_versions": dict(sorted(self.library_versions.items())),
            "thread_counts": dict(sorted(self.thread_counts.items())),
            "deterministic_flags": dict(sorted(self.deterministic_flags.items())),
        }
        return hashlib.sha256(json.dumps(payload, sort_keys=True).encode("utf-8")).hexdigest()


@dataclass(frozen=True)
class ManifestBinding:
    manifest_hash: str
    profile_hash: str
    profile_name: str
    timestamp: str


@dataclass(frozen=True)
class ReplayVerificationPolicy:
    """Policy for deciding when profile mismatches should fail replay verification."""

    max_profile_mismatches: int = 0


@dataclass(frozen=True)
class ReplayVerificationResult:
    passed: bool
    mismatch_count: int
    mismatches: Sequence[str]


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

        # Reproducibility controls.
        self._approved_profiles: Dict[str, DeterministicExecutionProfile] = {}
        self._approved_profiles_by_hash: Dict[str, DeterministicExecutionProfile] = {}
        self._manifest_bindings: Dict[str, ManifestBinding] = {}
        self._epsilon_by_profile_metric: Dict[str, Dict[str, float]] = {}

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

    def approve_execution_profile(self, profile: DeterministicExecutionProfile) -> str:
        profile_hash = profile.hash()
        self._approved_profiles[profile.name] = profile
        self._approved_profiles_by_hash[profile_hash] = profile
        self._epsilon_by_profile_metric.setdefault(profile.name, {})
        return profile_hash

    def bind_manifest_to_execution_profile(self, manifest: Mapping[str, object] | str, profile_name: str) -> ManifestBinding:
        if profile_name not in self._approved_profiles:
            raise ValueError(f"Profile '{profile_name}' is not approved")

        manifest_hash = self._hash_manifest(manifest)
        profile = self._approved_profiles[profile_name]
        binding = ManifestBinding(
            manifest_hash=manifest_hash,
            profile_hash=profile.hash(),
            profile_name=profile_name,
            timestamp=datetime.now(timezone.utc).isoformat(),
        )
        self._manifest_bindings[manifest_hash] = binding
        return binding

    def set_profile_epsilon(self, profile_name: str, metric_type: str, epsilon: float) -> None:
        if profile_name not in self._approved_profiles:
            raise ValueError(f"Profile '{profile_name}' is not approved")
        if epsilon < 0:
            raise ValueError("epsilon must be non-negative")

        self._epsilon_by_profile_metric.setdefault(profile_name, {})[metric_type] = epsilon

    def epsilon_for(self, profile_name: str, metric_type: str) -> float:
        profile_epsilons = self._epsilon_by_profile_metric.get(profile_name, {})
        if metric_type not in profile_epsilons:
            raise KeyError(f"No epsilon configured for profile '{profile_name}' metric '{metric_type}'")
        return profile_epsilons[metric_type]

    def verify_replay_profile(
        self,
        manifest: Mapping[str, object] | str,
        replay_profile: DeterministicExecutionProfile,
        policy: ReplayVerificationPolicy | None = None,
    ) -> ReplayVerificationResult:
        policy = policy or ReplayVerificationPolicy()

        manifest_hash = self._hash_manifest(manifest)
        binding = self._manifest_bindings.get(manifest_hash)
        if binding is None:
            raise KeyError("Manifest has no profile binding")

        expected_profile = self._approved_profiles_by_hash.get(binding.profile_hash)
        if expected_profile is None:
            raise KeyError("Bound profile hash is no longer approved")
        mismatches = self._profile_mismatches(expected_profile, replay_profile)
        mismatch_count = len(mismatches)
        passed = mismatch_count <= policy.max_profile_mismatches

        return ReplayVerificationResult(passed=passed, mismatch_count=mismatch_count, mismatches=mismatches)

    def set_trace_coverage(self, layer: str, coverage: float) -> None:
        self._trace_coverage[layer] = max(0.0, min(100.0, coverage))

    def trace_coverage_graph(self) -> List[Dict[str, float]]:
        return [{"layer": layer, "coverage": value} for layer, value in sorted(self._trace_coverage.items())]

    def should_trigger_rollback(self) -> bool:
        return any(v < 80.0 for v in self._trace_coverage.values())

    @property
    def audit_log(self) -> List[AuditRecord]:
        return list(self._audit_log)

    @staticmethod
    def _hash_manifest(manifest: Mapping[str, object] | str) -> str:
        payload = manifest if isinstance(manifest, str) else json.dumps(manifest, sort_keys=True)
        return hashlib.sha256(payload.encode("utf-8")).hexdigest()

    @staticmethod
    def _profile_mismatches(
        expected: DeterministicExecutionProfile,
        actual: DeterministicExecutionProfile,
    ) -> List[str]:
        mismatches: List[str] = []

        if expected.name != actual.name:
            mismatches.append("profile.name")

        for key in sorted(set(expected.library_versions) | set(actual.library_versions)):
            if expected.library_versions.get(key) != actual.library_versions.get(key):
                mismatches.append(f"library_versions.{key}")

        for key in sorted(set(expected.thread_counts) | set(actual.thread_counts)):
            if expected.thread_counts.get(key) != actual.thread_counts.get(key):
                mismatches.append(f"thread_counts.{key}")

        for key in sorted(set(expected.deterministic_flags) | set(actual.deterministic_flags)):
            if expected.deterministic_flags.get(key) != actual.deterministic_flags.get(key):
                mismatches.append(f"deterministic_flags.{key}")

        return mismatches
