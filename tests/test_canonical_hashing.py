import hashlib
import json
from pathlib import Path

from codex.canonical_json import dumps_canonical
from codex.compliance import CANONICALIZATION_VERSION

FIXTURES = Path(__file__).parent / "fixtures" / "canonical_hash_vectors.json"


def test_canonical_hash_vectors_match_cross_implementation_fixtures() -> None:
    """Fixture vectors encode the frozen canonical contract (incl. NFC strings)."""
    vectors = json.loads(FIXTURES.read_text(encoding="utf-8"))
    for vector in vectors:
        assert vector["canonicalization_version"] == CANONICALIZATION_VERSION
        actual = dumps_canonical(vector["payload"])
        assert actual == vector["canonical_json"]
        digest = hashlib.sha256(actual.encode("utf-8")).hexdigest()
        assert digest == vector["sha256"]
