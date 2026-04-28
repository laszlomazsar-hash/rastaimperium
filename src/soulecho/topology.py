from __future__ import annotations

from contextlib import nullcontext
from copy import deepcopy
from datetime import datetime, timezone
from typing import Any


class TransactionValidationError(ValueError):
    """Raised when a topology transaction candidate fails validation."""


def commit_transaction(registry: Any, candidate: Any, reservations: Any) -> dict[str, Any]:
    """Atomically commit a topology transition into ``registry``.

    The function validates candidate IDs/invariants and reservation integrity under
    a single lock. No mutations are applied unless all validations pass.
    A single transaction event (success/failure) is emitted per invocation.
    """

    lock = getattr(registry, "lock", None) or getattr(registry, "_lock", None)
    lock_context = lock if lock is not None else nullcontext()

    with lock_context:
        baseline_hypotheses = _read_store(registry, "hypotheses", default=[])
        baseline_lineage = _read_store(registry, "lineage", default=[])

        try:
            candidate_items = _normalize_candidate(candidate)
            _validate_candidate_ids(candidate_items)
            _validate_candidate_invariants(registry, candidate_items)
            _validate_reservations(registry, candidate_items, reservations)

            next_lineage = deepcopy(list(baseline_lineage))
            next_lineage.append(_build_lineage_entry(candidate_items, reservations))

            _write_store(registry, "lineage", next_lineage)
            _write_store(registry, "hypotheses", deepcopy(candidate_items))

            return _emit_transaction_event(registry, True, "committed")
        except Exception as exc:
            # Explicit rollback to baseline to guarantee all-or-nothing semantics.
            _write_store(registry, "lineage", deepcopy(list(baseline_lineage)))
            _write_store(registry, "hypotheses", deepcopy(list(baseline_hypotheses)))
            return _emit_transaction_event(registry, False, str(exc))


def _normalize_candidate(candidate: Any) -> list[dict[str, Any]]:
    if isinstance(candidate, dict):
        if "hypotheses" in candidate:
            return deepcopy(list(candidate["hypotheses"]))
        if "id" in candidate:
            return [deepcopy(candidate)]
    if isinstance(candidate, list):
        return deepcopy(candidate)
    raise TransactionValidationError("candidate must be a hypothesis object/list")


def _validate_candidate_ids(candidate_items: list[dict[str, Any]]) -> None:
    if not candidate_items:
        raise TransactionValidationError("candidate cannot be empty")

    ids: list[str] = []
    for index, item in enumerate(candidate_items):
        if not isinstance(item, dict):
            raise TransactionValidationError(f"candidate[{index}] must be a mapping")
        hypothesis_id = item.get("id")
        if not isinstance(hypothesis_id, str) or not hypothesis_id.strip():
            raise TransactionValidationError(f"candidate[{index}] missing valid id")
        ids.append(hypothesis_id)

    if len(set(ids)) != len(ids):
        raise TransactionValidationError("candidate hypothesis ids must be unique")


def _validate_candidate_invariants(registry: Any, candidate_items: list[dict[str, Any]]) -> None:
    validator = getattr(registry, "validate_candidate_invariants", None)
    if callable(validator):
        result = validator(candidate_items)
        if result is False:
            raise TransactionValidationError("candidate invariants rejected")


def _validate_reservations(registry: Any, candidate_items: list[dict[str, Any]], reservations: Any) -> None:
    validator = getattr(registry, "validate_reservations", None)
    if callable(validator):
        result = validator(candidate_items, reservations)
        if result is False:
            raise TransactionValidationError("reservations rejected")
        return

    if reservations is None:
        return

    if not isinstance(reservations, list):
        raise TransactionValidationError("reservations must be a list")

    candidate_ids = {item["id"] for item in candidate_items}
    for index, reservation in enumerate(reservations):
        if not isinstance(reservation, dict):
            raise TransactionValidationError(f"reservation[{index}] must be a mapping")
        reserved_id = reservation.get("id")
        if reserved_id is not None and reserved_id not in candidate_ids:
            raise TransactionValidationError(f"reservation[{index}] id {reserved_id!r} not in candidate")


def _build_lineage_entry(candidate_items: list[dict[str, Any]], reservations: Any) -> dict[str, Any]:
    return {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "candidate_ids": [item["id"] for item in candidate_items],
        "reservation_count": len(reservations) if isinstance(reservations, list) else 0,
    }


def _emit_transaction_event(registry: Any, success: bool, reason: str) -> dict[str, Any]:
    event = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "success": success,
        "reason": reason,
    }

    events = _read_store(registry, "transaction_events", default=[])
    events = list(events)
    events.append(event)
    _write_store(registry, "transaction_events", events)

    emitter = getattr(registry, "emit_transaction_event", None)
    if callable(emitter):
        emitter(event)

    return event


def _read_store(registry: Any, key: str, default: Any) -> Any:
    if isinstance(registry, dict):
        return registry.get(key, default)
    return getattr(registry, key, default)


def _write_store(registry: Any, key: str, value: Any) -> None:
    if isinstance(registry, dict):
        registry[key] = value
        return
    setattr(registry, key, value)
