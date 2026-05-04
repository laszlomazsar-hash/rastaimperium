"""Telemetry system for recording events."""

from __future__ import annotations

import logging
from typing import Any

logger = logging.getLogger(__name__)


class TelemetrySystem:
    async def record_event(self, event_name: str, source: str, **metadata: Any) -> None:
        logger.info("Telemetry event %s from %s: %s", event_name, source, metadata)
