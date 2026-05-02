import hashlib
import json
from datetime import datetime


def anchor_state(state: dict) -> str:
    """Simulate blockchain anchoring via SHA256 hash."""
    payload = json.dumps(state, sort_keys=True)
    hash_digest = hashlib.sha256(payload.encode()).hexdigest()
    timestamp = datetime.utcnow().isoformat()
    print(f"[ANCHOR] {timestamp}: {hash_digest}")
    return hash_digest
