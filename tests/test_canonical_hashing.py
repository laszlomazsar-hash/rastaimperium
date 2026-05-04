import json
from pathlib import Path

from codex.compliance import CANONICALIZATION_VERSION, canonical_json, sha256_canonical_digest
from backend.src.codex.compliance import CANONICALIZATION_VERSION, canonical_json, sha256_canonical_digest


FIXTURES = Path(__file__).parent / "fixtures" / "canonical_hash_vectors.json"


def test_canonical_hash_vectors_match_cross_implementation_fixtures() -> None:
    vectors = json.loads(FIXTURES.read_text(encoding="utf-8"))
    for vector in vectors:
        assert vector["canonicalization_version"] == CANONICALIZATION_VERSION
        assert canonical_json(vector["payload"]) == vector["canonical_json"]
        assert sha256_canonical_digest(vector["payload"]) == vector["sha256"]
