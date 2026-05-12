from __future__ import annotations

import argparse
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

COMPILER_VERSION = "1.0.0"
REQUIRED_SOURCE_FIELDS = (
    "policy_id",
    "schema_version",
    "ruleset_version",
    "governance_version",
    "canon_spec_version",
    "states",
    "transitions",
)


class PolicyCompileError(RuntimeError):
    """Raised when compilation cannot proceed safely."""


def _canonical_dumps(payload: Any) -> str:
    return json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def _sha256_hex(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def _utc_iso8601_ms() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")


def _load_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise PolicyCompileError(f"Missing required file: {path}") from exc
    except json.JSONDecodeError as exc:
        raise PolicyCompileError(f"Invalid JSON in {path}: {exc}") from exc


def _validate_source(source: dict[str, Any]) -> None:
    missing = [field for field in REQUIRED_SOURCE_FIELDS if field not in source]
    if missing:
        raise PolicyCompileError(f"Missing required source fields: {', '.join(missing)}")
    if not isinstance(source["states"], list) or not source["states"]:
        raise PolicyCompileError("states must be a non-empty list")
    if len(source["states"]) != len(set(source["states"])):
        raise PolicyCompileError("states contains duplicates (ambiguous state definition)")
    if not isinstance(source["transitions"], list) or not source["transitions"]:
        raise PolicyCompileError("transitions must be a non-empty list")

    for idx, item in enumerate(source["transitions"]):
        if not isinstance(item, dict):
            raise PolicyCompileError(f"transitions[{idx}] must be an object")
        if set(item.keys()) != {"from", "to"}:
            raise PolicyCompileError(
                f"transitions[{idx}] must contain exactly 'from' and 'to' to avoid ambiguity"
            )
        if item["from"] not in source["states"] and item["from"] != "ANY":
            raise PolicyCompileError(f"transitions[{idx}].from references unknown state")
        if item["to"] not in source["states"]:
            raise PolicyCompileError(f"transitions[{idx}].to references unknown state")


def _validate_against_schema(candidate: dict[str, Any], schema: dict[str, Any]) -> None:
    required = schema.get("required", [])
    for key in required:
        if key not in candidate:
            raise PolicyCompileError(f"Compiled IR missing schema-required field: {key}")

    properties = schema.get("properties", {})
    type_map = {"object": dict, "array": list, "string": str}
    for key, rules in properties.items():
        if key not in candidate:
            continue
        declared_type = rules.get("type")
        py_type = type_map.get(declared_type)
        if py_type is not None and not isinstance(candidate[key], py_type):
            raise PolicyCompileError(
                f"Field '{key}' has invalid type. expected={declared_type} actual={type(candidate[key]).__name__}"
            )


def compile_policy(source: dict[str, Any], generated_at: str | None = None) -> dict[str, Any]:
    _validate_source(source)
    ordered_transitions = sorted(source["transitions"], key=lambda x: (x["from"], x["to"]))
    ir_core = {
        "policy_id": source["policy_id"],
        "schema_version": source["schema_version"],
        "ruleset_version": source["ruleset_version"],
        "governance_version": source["governance_version"],
        "canon_spec_version": source["canon_spec_version"],
        "cert_profile": source.get("cert_profile"),
        "states": sorted(source["states"]),
        "transitions": ordered_transitions,
    }

    source_bytes = _canonical_dumps(source).encode("utf-8")
    core_bytes = _canonical_dumps(ir_core).encode("utf-8")
    generated = generated_at or _utc_iso8601_ms()
    metadata = {
        "compiler_version": COMPILER_VERSION,
        "input_digest": _sha256_hex(source_bytes),
        "output_digest": _sha256_hex(core_bytes),
        "generated_at": generated,
    }

    final_ir = {"metadata": metadata, "policy": ir_core}
    final_bytes = _canonical_dumps(final_ir).encode("utf-8")
    final_ir["metadata"]["output_digest"] = _sha256_hex(final_bytes)
    return final_ir


def main() -> None:
    parser = argparse.ArgumentParser(description="Compile governance policy source into policy IR")
    parser.add_argument("--source", type=Path, required=True, help="Path to governance source JSON")
    parser.add_argument("--schema", type=Path, required=True, help="Path to policy-ir.v1.json")
    parser.add_argument("--output", type=Path, required=True, help="Output path for policy.ir.json")
    args = parser.parse_args()

    source = _load_json(args.source)
    if not isinstance(source, dict):
        raise PolicyCompileError("Policy source must be a JSON object")
    schema = _load_json(args.schema)
    if not isinstance(schema, dict):
        raise PolicyCompileError("Schema must be a JSON object")

    compiled = compile_policy(source)
    _validate_against_schema(compiled, schema)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(_canonical_dumps(compiled) + "\n", encoding="utf-8")


if __name__ == "__main__":
    try:
        main()
    except PolicyCompileError as exc:
        raise SystemExit(f"policy compile failed: {exc}")
