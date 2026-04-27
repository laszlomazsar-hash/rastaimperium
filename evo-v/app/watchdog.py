"""Self-healing watchdog loop for EVO-V runtime."""

from __future__ import annotations

import os
import threading
import time
from typing import Any

from state import STATE

WATCHDOG_INTERVAL_SECONDS = 10


def _validate_runtime(app: Any) -> None:
    if not hasattr(app, "routes"):
        raise RuntimeError("ROUTE_TABLE_CORRUPTED")

    if len(getattr(app, "routes")) == 0:
        raise RuntimeError("NO_REGISTERED_ROUTES")


def monitor_loop(app: Any) -> None:
    while True:
        try:
            _validate_runtime(app)
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
