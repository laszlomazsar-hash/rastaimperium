from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Dict, List, Literal


RuntimeProfile = Literal["A", "B", "C"]


@dataclass
class AuditRecord:
    actor: str
    action: str
    article: str
    metadata: Dict[str, object]
    timestamp: str
    digest: str
    profile_id: RuntimeProfile


@dataclass
class VerificationArtifact:
    profile_id: RuntimeProfile
    certification_status: str
    certificate_generation_enabled: bool
    rollback_required: bool
    trace_coverage: List[Dict[str, float | str]]


class ComplianceEngine:
    """Article II-IV observability + audit logging + rollback triggers."""

    certification_mode_allowed_profiles = {"A", "B"}

    def __init__(self, runtime_profile: RuntimeProfile = "A") -> None:
        if runtime_profile not in {"A", "B", "C"}:
            raise ValueError(f"Unsupported runtime profile: {runtime_profile}")
        self._audit_log: List[AuditRecord] = []
        self._trace_coverage: Dict[str, float] = {f"L{i}": 100.0 for i in range(1, 10)}
        self.runtime_profile: RuntimeProfile = runtime_profile

    def append_audit_record(self, actor: str, action: str, article: str, metadata: Dict[str, object]) -> AuditRecord:
        timestamp = datetime.now(timezone.utc).isoformat()
        payload = {
            "actor": actor,
            "action": action,
            "article": article,
            "metadata": {**metadata, "profile_id": self.runtime_profile},
            "timestamp": timestamp,
            "profile_id": self.runtime_profile,
        }
        digest = hashlib.sha256(json.dumps(payload, sort_keys=True).encode("utf-8")).hexdigest()
        record = AuditRecord(**payload, digest=digest)
        self._audit_log.append(record)
        return record

    def set_trace_coverage(self, layer: str, coverage: float) -> None:
        self._trace_coverage[layer] = max(0.0, min(100.0, coverage))

    def trace_coverage_graph(self) -> List[Dict[str, float | str]]:
        return [
            {"layer": layer, "coverage": value, "profile_id": self.runtime_profile}
            for layer, value in sorted(self._trace_coverage.items())
        ]

    def should_trigger_rollback(self) -> bool:
        return any(v < 80.0 for v in self._trace_coverage.values())

    @property
    def certification_status(self) -> str:
        if self.runtime_profile not in self.certification_mode_allowed_profiles:
            return "invalid"
        return "certified"

    @property
    def certificate_generation_enabled(self) -> bool:
        return self.certification_status != "invalid"

    def verification_artifact(self) -> VerificationArtifact:
        return VerificationArtifact(
            profile_id=self.runtime_profile,
            certification_status=self.certification_status,
            certificate_generation_enabled=self.certificate_generation_enabled,
            rollback_required=self.should_trigger_rollback(),
            trace_coverage=self.trace_coverage_graph(),
        )

    @property
    def audit_log(self) -> List[AuditRecord]:
        return list(self._audit_log)
