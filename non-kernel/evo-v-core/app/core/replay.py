import copy
import hashlib
import json
from typing import Any

FLOAT_PRECISION_DIGITS = 9
FLOAT_TOLERANCE = 10 ** (-FLOAT_PRECISION_DIGITS)
REQUIRED_METADATA_FIELDS = {
    "operation_order",
    "numeric_scheme",
    "solver_settings",
    "iteration_counts",
    "projection_steps",
}


def _canonical_float(value: float) -> float:
    return round(value, FLOAT_PRECISION_DIGITS)


def _normalize_payload(value: Any) -> Any:
    if isinstance(value, float):
        return _canonical_float(value)
    if isinstance(value, dict):
        return {key: _normalize_payload(value[key]) for key in sorted(value.keys())}
    if isinstance(value, list):
        return [_normalize_payload(item) for item in value]
    return value


def canonicalize_payload(payload: dict[str, Any]) -> str:
    normalized = _normalize_payload(payload)
    return json.dumps(normalized, sort_keys=True, separators=(",", ":"), ensure_ascii=False)


def payload_hash(payload: dict[str, Any]) -> str:
    canonical_payload = canonicalize_payload(payload)
    return hashlib.sha256(canonical_payload.encode("utf-8")).hexdigest()


def _merge_patch(target: dict[str, Any], delta: dict[str, Any]) -> dict[str, Any]:
    merged = copy.deepcopy(target)
    for key in sorted(delta.keys()):
        value = delta[key]
        if isinstance(value, dict) and isinstance(merged.get(key), dict):
            merged[key] = _merge_patch(merged[key], value)
        else:
            merged[key] = value
    return merged


def _assert_required_metadata(proof: dict[str, Any]) -> None:
    metadata = proof.get("metadata", {})
    missing = REQUIRED_METADATA_FIELDS.difference(metadata.keys())
    if missing:
        missing_fields = ", ".join(sorted(missing))
        raise ValueError(f"proof is missing deterministic metadata fields: {missing_fields}")


def _apply_proof(state: dict[str, Any], proof: dict[str, Any]) -> dict[str, Any]:
    _assert_required_metadata(proof)
    metadata = proof["metadata"]

    operation_order = metadata.get("operation_order", [])
    delta = proof.get("delta", {})

    ordered_delta: dict[str, Any] = {}
    for operation_key in operation_order:
        if operation_key in delta:
            ordered_delta[operation_key] = delta[operation_key]

    for operation_key in sorted(delta.keys()):
        if operation_key not in ordered_delta:
            ordered_delta[operation_key] = delta[operation_key]

    next_state = _merge_patch(state, ordered_delta)
    return _normalize_payload(next_state)


def replay(initial_state: dict[str, Any], proof_sequence: list[dict[str, Any]]) -> list[dict[str, Any]]:
    reconstructed_states: list[dict[str, Any]] = [_normalize_payload(copy.deepcopy(initial_state))]
    state = copy.deepcopy(initial_state)

    for proof in proof_sequence:
        state = _apply_proof(state, proof)
        reconstructed_states.append(copy.deepcopy(state))

    return reconstructed_states


def replay_state_hashes(initial_state: dict[str, Any], proof_sequence: list[dict[str, Any]]) -> list[str]:
    states = replay(initial_state, proof_sequence)
    return [payload_hash(state) for state in states]


def verify_replay(
    initial_state: dict[str, Any],
    proof_sequence: list[dict[str, Any]],
    expected_hashes: list[str] | None = None,
) -> dict[str, Any]:
    hashes = replay_state_hashes(initial_state, proof_sequence)

    if expected_hashes is None:
        comparison_hashes = replay_state_hashes(initial_state, proof_sequence)
    else:
        comparison_hashes = expected_hashes

    max_ticks = min(len(hashes), len(comparison_hashes))
    for tick in range(max_ticks):
        if hashes[tick] != comparison_hashes[tick]:
            return {"success": False, "first_divergence_tick": tick, "reconstructed_hashes": hashes}

    if len(hashes) != len(comparison_hashes):
        return {
            "success": False,
            "first_divergence_tick": max_ticks,
            "reconstructed_hashes": hashes,
        }

    return {"success": True, "first_divergence_tick": None, "reconstructed_hashes": hashes}
