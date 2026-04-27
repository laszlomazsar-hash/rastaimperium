from __future__ import annotations

import hashlib
import hmac
import json
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Dict, List, Mapping


LINEAGE_SCHEMA_VERSION = "1.0.0"
DATASET_SNAPSHOT_FORMAT_VERSION = "1.0.0"
SIGNATURE_SCHEME = "HMAC-SHA256"
KEY_ROTATION_POLICY_DAYS = 90


@dataclass
class AuditRecord:
    actor: str
    action: str
    article: str
    metadata: Dict[str, object]
    timestamp: str
    digest: str


@dataclass(frozen=True)
class KeyDescriptor:
    key_id: str
    status: str
    valid_from: str
    valid_until: str


@dataclass(frozen=True)
class TrustRoot:
    """Trust root definition for lineage verification.

    - Signature scheme: HMAC-SHA256.
    - Key rotation policy: rotate active signing keys every 90 days.
    - Trust root: key descriptors + secret material keyed by key_id.
    """

    root_id: str
    scheme: str
    rotation_days: int
    key_descriptors: Mapping[str, KeyDescriptor]
    key_ring: Mapping[str, str]


@dataclass(frozen=True)
class DatasetSnapshot:
    format_version: str
    dataset_id: str
    created_at: str
    rows: List[Mapping[str, object]]
    source_uri: str

    def canonical_payload(self) -> Dict[str, object]:
        """Snapshot format + deterministic hashing payload."""

        return {
            "format_version": self.format_version,
            "dataset_id": self.dataset_id,
            "created_at": self.created_at,
            "source_uri": self.source_uri,
            "rows": [dict(row) for row in self.rows],
        }

    def content_hash(self) -> str:
        encoded = json.dumps(
            self.canonical_payload(),
            sort_keys=True,
            separators=(",", ":"),
            ensure_ascii=True,
        ).encode("utf-8")
        return hashlib.sha256(encoded).hexdigest()


@dataclass(frozen=True)
class CalibrationLineageRecord:
    schema_version: str
    calibration_id: str
    dataset_snapshot: DatasetSnapshot
    dataset_hash: str
    artifact_versions: Mapping[str, str]
    signed_at: str
    key_id: str
    signature: str

    def signing_payload(self) -> Dict[str, object]:
        return {
            "schema_version": self.schema_version,
            "calibration_id": self.calibration_id,
            "dataset_snapshot": self.dataset_snapshot.canonical_payload(),
            "dataset_hash": self.dataset_hash,
            "artifact_versions": dict(self.artifact_versions),
            "signed_at": self.signed_at,
            "key_id": self.key_id,
        }


class LineageVerificationError(ValueError):
    pass


class CalibrationReplayError(ValueError):
    pass


def build_trust_root(key_ring: Mapping[str, str], root_id: str = "rastaimperium-codex-root") -> TrustRoot:
    descriptors = {
        key_id: KeyDescriptor(
            key_id=key_id,
            status="active",
            valid_from=datetime.now(timezone.utc).date().isoformat(),
            valid_until="",
        )
        for key_id in key_ring
    }
    return TrustRoot(
        root_id=root_id,
        scheme=SIGNATURE_SCHEME,
        rotation_days=KEY_ROTATION_POLICY_DAYS,
        key_descriptors=descriptors,
        key_ring=dict(key_ring),
    )


def _canonical_json(payload: Mapping[str, object]) -> bytes:
    return json.dumps(payload, sort_keys=True, separators=(",", ":"), ensure_ascii=True).encode("utf-8")


def sign_lineage_payload(payload: Mapping[str, object], secret: str) -> str:
    return hmac.new(secret.encode("utf-8"), _canonical_json(payload), hashlib.sha256).hexdigest()


def create_lineage_record(
    calibration_id: str,
    dataset_snapshot: DatasetSnapshot,
    artifact_versions: Mapping[str, str],
    key_id: str,
    secret: str,
) -> CalibrationLineageRecord:
    dataset_hash = dataset_snapshot.content_hash()
    record = CalibrationLineageRecord(
        schema_version=LINEAGE_SCHEMA_VERSION,
        calibration_id=calibration_id,
        dataset_snapshot=dataset_snapshot,
        dataset_hash=dataset_hash,
        artifact_versions=dict(artifact_versions),
        signed_at=datetime.now(timezone.utc).isoformat(),
        key_id=key_id,
        signature="",
    )
    signature = sign_lineage_payload(record.signing_payload(), secret)
    return CalibrationLineageRecord(**{**record.__dict__, "signature": signature})


def verify_lineage_record(record: CalibrationLineageRecord, trust_root: TrustRoot) -> None:
    """Load-time verification: signature + hash + schema version."""

    if record.schema_version != LINEAGE_SCHEMA_VERSION:
        raise LineageVerificationError(
            f"Unsupported lineage schema version {record.schema_version}; expected {LINEAGE_SCHEMA_VERSION}."
        )

    if record.dataset_snapshot.format_version != DATASET_SNAPSHOT_FORMAT_VERSION:
        raise LineageVerificationError(
            "Unsupported dataset snapshot format "
            f"{record.dataset_snapshot.format_version}; expected {DATASET_SNAPSHOT_FORMAT_VERSION}."
        )

    expected_hash = record.dataset_snapshot.content_hash()
    if expected_hash != record.dataset_hash:
        raise LineageVerificationError("Dataset hash mismatch in lineage record.")

    if trust_root.scheme != SIGNATURE_SCHEME:
        raise LineageVerificationError(f"Unsupported trust root scheme: {trust_root.scheme}.")

    secret = trust_root.key_ring.get(record.key_id)
    if not secret:
        raise LineageVerificationError(f"Unknown key id: {record.key_id}.")

    expected_signature = sign_lineage_payload(record.signing_payload(), secret)
    if not hmac.compare_digest(record.signature, expected_signature):
        raise LineageVerificationError("Lineage signature verification failed.")


class ComplianceEngine:
    """Article II-IV observability + audit logging + rollback triggers."""

    def __init__(self) -> None:
        self._audit_log: List[AuditRecord] = []
        self._trace_coverage: Dict[str, float] = {f"L{i}": 100.0 for i in range(1, 10)}

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

    def replay_calibration(
        self,
        lineage_record: CalibrationLineageRecord,
        runtime_artifact_versions: Mapping[str, str],
        trust_root: TrustRoot,
    ) -> Dict[str, object]:
        """Replays only when runtime artifacts exactly match lineage versions."""

        verify_lineage_record(lineage_record, trust_root)

        expected = dict(lineage_record.artifact_versions)
        observed = dict(runtime_artifact_versions)
        if observed != expected:
            raise CalibrationReplayError(
                "Calibration replay requires exact lineage artifact versions; "
                f"expected {expected}, got {observed}."
            )

        return {
            "status": "replayed",
            "calibration_id": lineage_record.calibration_id,
            "artifact_versions": expected,
            "dataset_hash": lineage_record.dataset_hash,
        }

    @property
    def audit_log(self) -> List[AuditRecord]:
        return list(self._audit_log)
