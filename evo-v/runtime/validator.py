"""Validation placeholders for deterministic-kernel runtime."""

from .event import Event


def validate_event(event: Event) -> None:
    """Minimal deterministic checks for placeholder lifecycle."""

    if event.sequence < 0:
        raise ValueError("event.sequence must be non-negative")
    if not event.event_type:
        raise ValueError("event.event_type must be non-empty")
