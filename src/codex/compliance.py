from __future__ import annotations

import hashlib
import json
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Dict, List


@dataclass
class AuditRecord:
    cert_index: int
    actor: str
    action: str
    article: str
    metadata: Dict[str, object]
    timestamp: str
    prev_cert_hash: str
    cert_hash: str
    digest: str


@dataclass
class CheckpointRecord:
    checkpoint_index: int
    cert_index: int
    cert_hash: str
    anchored_at: str
    external_anchor: str | None = None


class ComplianceEngine:
    """Article II-IV observability + audit logging + rollback triggers."""

    def __init__(self, checkpoint_interval: int = 5) -> None:
        self._audit_log: List[AuditRecord] = []
        self._trace_coverage: Dict[str, float] = {f"L{i}": 100.0 for i in range(1, 10)}
        self._checkpoints: List[CheckpointRecord] = []
        self._last_cert_hash = "0" * 64
        self._checkpoint_interval = max(1, checkpoint_interval)

    @staticmethod
    def _canonical_json(payload: Dict[str, object]) -> str:
        return json.dumps(payload, sort_keys=True, separators=(",", ":"), ensure_ascii=False)

    def _build_certificate_payload(
        self,
        cert_index: int,
        actor: str,
        action: str,
        article: str,
        metadata: Dict[str, object],
        timestamp: str,
        prev_cert_hash: str,
    ) -> Dict[str, object]:
        return {
            "cert_index": cert_index,
            "actor": actor,
            "action": action,
            "article": article,
            "metadata": metadata,
            "timestamp": timestamp,
            "prev_cert_hash": prev_cert_hash,
        }

    @staticmethod
    def _hash_payload(payload: Dict[str, object]) -> str:
        canonical_payload = ComplianceEngine._canonical_json(payload)
        return hashlib.sha256(canonical_payload.encode("utf-8")).hexdigest()

    def _maybe_anchor_checkpoint(self) -> None:
        if not self._audit_log:
            return
        if len(self._audit_log) % self._checkpoint_interval != 0:
            return
        self.anchor_checkpoint()

    def append_audit_record(self, actor: str, action: str, article: str, metadata: Dict[str, object]) -> AuditRecord:
        timestamp = datetime.now(timezone.utc).isoformat()
        cert_index = len(self._audit_log) + 1
        payload = self._build_certificate_payload(
            cert_index=cert_index,
            actor=actor,
            action=action,
            article=article,
            metadata=metadata,
            timestamp=timestamp,
            prev_cert_hash=self._last_cert_hash,
        )
        cert_hash = self._hash_payload(payload)
        record = AuditRecord(**payload, cert_hash=cert_hash, digest=cert_hash)

        self._audit_log.append(record)
        self._last_cert_hash = cert_hash
        self._maybe_anchor_checkpoint()
        return record

    def anchor_checkpoint(self, external_anchor: str | None = None) -> CheckpointRecord:
        if not self._audit_log:
            raise ValueError("Cannot anchor checkpoint without certificates")

        record = self._audit_log[-1]
        checkpoint = CheckpointRecord(
            checkpoint_index=len(self._checkpoints) + 1,
            cert_index=record.cert_index,
            cert_hash=record.cert_hash,
            anchored_at=datetime.now(timezone.utc).isoformat(),
            external_anchor=external_anchor,
        )
        self._checkpoints.append(checkpoint)
        return checkpoint

    def verify_temporal_integrity(self, records: List[AuditRecord] | None = None) -> Dict[str, object]:
        certs = list(records) if records is not None else self._audit_log
        errors: List[str] = []
        previous_hash = "0" * 64

        for expected_index, cert in enumerate(certs, start=1):
            if cert.cert_index != expected_index:
                errors.append(
                    f"Certificate index mismatch at position {expected_index}: "
                    f"expected {expected_index}, found {cert.cert_index}."
                )

            if cert.prev_cert_hash != previous_hash:
                errors.append(
                    f"Broken linkage at cert_index={cert.cert_index}: prev_cert_hash does not match prior cert_hash."
                )

            payload = self._build_certificate_payload(
                cert_index=cert.cert_index,
                actor=cert.actor,
                action=cert.action,
                article=cert.article,
                metadata=cert.metadata,
                timestamp=cert.timestamp,
                prev_cert_hash=cert.prev_cert_hash,
            )
            expected_hash = self._hash_payload(payload)
            if cert.cert_hash != expected_hash:
                errors.append(f"Hash mismatch at cert_index={cert.cert_index}.")

            previous_hash = cert.cert_hash

        return {
            "valid": len(errors) == 0,
            "errors": errors,
            "certificates_checked": len(certs),
            "latest_cert_hash": previous_hash if certs else None,
        }

    def set_trace_coverage(self, layer: str, coverage: float) -> None:
        self._trace_coverage[layer] = max(0.0, min(100.0, coverage))

    def trace_coverage_graph(self) -> List[Dict[str, float]]:
        return [{"layer": layer, "coverage": value} for layer, value in sorted(self._trace_coverage.items())]

    def should_trigger_rollback(self) -> bool:
        return any(v < 80.0 for v in self._trace_coverage.values())

    @property
    def audit_log(self) -> List[AuditRecord]:
        return list(self._audit_log)

    @property
    def checkpoints(self) -> List[CheckpointRecord]:
        return list(self._checkpoints)
