from __future__ import annotations

import json
import threading
from pathlib import Path

from models.proof_models import ProofObject


class ProofStore:
    """Append-only local proof store with monotonic tick IDs."""

    def __init__(self, storage_dir: Path | None = None) -> None:
        base_dir = storage_dir or Path(__file__).resolve().parents[1] / "storage" / "proofs"
        self.storage_dir = base_dir
        self.storage_dir.mkdir(parents=True, exist_ok=True)
        self._counter_path = self.storage_dir / "counter.txt"
        self._lock = threading.Lock()

    def next_tick_id(self) -> int:
        with self._lock:
            current = 0
            if self._counter_path.exists():
                raw = self._counter_path.read_text(encoding="utf-8").strip()
                if raw:
                    current = int(raw)
            next_tick = current + 1
            self._counter_path.write_text(str(next_tick), encoding="utf-8")
            return next_tick

    def append(self, proof: ProofObject) -> ProofObject:
        proof_path = self.storage_dir / f"tick_{proof.tick_id:020d}.json"
        proof_path.write_text(
            json.dumps(proof.model_dump(mode="json"), ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        return proof

    def get(self, tick_id: int) -> ProofObject | None:
        proof_path = self.storage_dir / f"tick_{tick_id:020d}.json"
        if not proof_path.exists():
            return None
        return ProofObject.model_validate_json(proof_path.read_text(encoding="utf-8"))

    def latest(self) -> ProofObject | None:
        proof_files = sorted(self.storage_dir.glob("tick_*.json"))
        if not proof_files:
            return None
        return ProofObject.model_validate_json(proof_files[-1].read_text(encoding="utf-8"))
