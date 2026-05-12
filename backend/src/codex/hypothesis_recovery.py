from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Iterable, List, Sequence

from src.governance.runtime import PolicyLoadError, load_runtime_policy


@dataclass(frozen=True)
class HypothesisPolicy:
    """Central policy used by prune, fallback, and commit gate logic."""

    min_viable_hypotheses: int = 3
    temporary_bootstrap_min_hypotheses: int = 1
    bootstrap_grace_period_seconds: int = 300


@dataclass
class BootstrapState:
    started_at: datetime | None = None

    def is_active(self, now: datetime, grace_period_seconds: int) -> bool:
        if self.started_at is None:
            return False
        return now < self.started_at + timedelta(seconds=grace_period_seconds)


class HypothesisRecoveryEngine:
    def __init__(
        self,
        policy: HypothesisPolicy | None = None,
        *,
        governance_manifest_path: str = "config/governance_manifest.json",
    ) -> None:
        self.policy = policy or HypothesisPolicy()
        self._bootstrap_state = BootstrapState()
        self._runtime_policy = load_runtime_policy(governance_manifest_path)

    def prune_hypotheses(self, hypotheses: Sequence[str]) -> List[str]:
        """Prune duplicate/empty values and preserve order."""
        seen: set[str] = set()
        pruned: List[str] = []
        for item in hypotheses:
            normalized = item.strip()
            if not normalized or normalized in seen:
                continue
            seen.add(normalized)
            pruned.append(normalized)
        return pruned

    def recover_hypotheses(
        self,
        hypotheses: Sequence[str],
        *,
        allow_temporary_bootstrap: bool = False,
        now: datetime | None = None,
    ) -> List[str]:
        """Recover to a minimum viable hypothesis set.

        Recovery strategy:
        - If we already meet `min_viable_hypotheses`, keep the set.
        - If temporary bootstrap is enabled, allow a lower threshold for a limited time.
        - Otherwise, synthesize deterministic bootstrap hypotheses up to policy minimum.
        """
        current_time = now or datetime.now(timezone.utc)
        self._runtime_policy.guards.validate_event_type("COMMIT_FINALIZED")
        self._runtime_policy.guards.validate_version_bundle({
            "schema_version": self._runtime_policy.schema_version,
            "ruleset_version": self._runtime_policy.ruleset_version,
            "governance_version": self._runtime_policy.governance_version,
            "canon_spec_version": "1.0"
        })
        pruned = self.prune_hypotheses(hypotheses)

        if len(pruned) >= self.policy.min_viable_hypotheses:
            self._bootstrap_state.started_at = None
            return pruned

        if allow_temporary_bootstrap:
            if self._bootstrap_state.started_at is None:
                self._bootstrap_state.started_at = current_time
            if self._bootstrap_state.is_active(current_time, self.policy.bootstrap_grace_period_seconds):
                return pruned

        self._bootstrap_state.started_at = None
        return self._bootstrap_fallback(pruned)

    def _bootstrap_fallback(self, hypotheses: Iterable[str]) -> List[str]:
        recovered = list(hypotheses)
        while len(recovered) < self.policy.min_viable_hypotheses:
            recovered.append(f"bootstrap-hypothesis-{len(recovered) + 1}")
        return recovered

    def required_commit_count(
        self,
        *,
        now: datetime | None = None,
        allow_temporary_bootstrap: bool = False,
    ) -> int:
        current_time = now or datetime.now(timezone.utc)
        if allow_temporary_bootstrap and self._bootstrap_state.is_active(
            current_time,
            self.policy.bootstrap_grace_period_seconds,
        ):
            return self.policy.temporary_bootstrap_min_hypotheses
        return self.policy.min_viable_hypotheses

    def commit_gate(
        self,
        hypotheses: Sequence[str],
        *,
        now: datetime | None = None,
        allow_temporary_bootstrap: bool = False,
    ) -> bool:
        pruned = self.prune_hypotheses(hypotheses)
        required = self.required_commit_count(
            now=now,
            allow_temporary_bootstrap=allow_temporary_bootstrap,
        )
        return len(pruned) >= required
