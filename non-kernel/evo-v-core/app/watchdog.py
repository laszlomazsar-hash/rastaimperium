"""Self-healing watchdog loop for EVO-V runtime."""

from __future__ import annotations

import os
import threading
import time
from typing import Any

from proof_verifier import verify_proof_inference
from state import ProofStatus, STATE

WATCHDOG_INTERVAL_SECONDS = 10
CRITICAL_PROOF_CLASSES = {
    item.strip()
    for item in os.getenv("EVO_V_CRITICAL_PROOF_CLASSES", "safety,integrity").split(",")
    if item.strip()
}


def _validate_runtime(app: Any) -> None:
    if not hasattr(app, "routes"):
        raise RuntimeError("ROUTE_TABLE_CORRUPTED")

    if len(getattr(app, "routes")) == 0:
        raise RuntimeError("NO_REGISTERED_ROUTES")


def _validate_proof_inference(app: Any) -> None:
    context = getattr(getattr(app, "state", object()), "proof_context", None)
    result = verify_proof_inference(context, CRITICAL_PROOF_CLASSES)

    if result.status == ProofStatus.INVALID:
        STATE.record_proof_attack(result.reason, result.evidence)
        print(
            f"[EVO-V WATCHDOG] Proof attack detected: {result.reason} evidence={result.evidence}",
            flush=True,
        )
        if result.hard_fail_eligible:
            os._exit(1)
        return

    STATE.update_proof_status(result.status)


def monitor_loop(app: Any) -> None:
    while True:
        try:
            _validate_runtime(app)
            _validate_proof_inference(app)
        except Exception as exc:  # deliberate broad catch for hard recovery path
            reason = str(exc)
            STATE.mark_failure(reason)
            print(f"[EVO-V WATCHDOG] Failure detected: {reason}", flush=True)
            os._exit(1)

        time.sleep(WATCHDOG_INTERVAL_SECONDS)


def start_watchdog(app: Any) -> None:
    if not STATE.mark_watchdog_started():
        return

    thread = threading.Thread(
        target=monitor_loop,
        args=(app,),
        daemon=True,
        name="evo-v-watchdog",
    )
    thread.start()
