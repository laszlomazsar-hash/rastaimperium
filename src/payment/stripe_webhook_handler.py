from __future__ import annotations

from dataclasses import dataclass


@dataclass
class BillingUsage:
    api_calls: int
    tokens: int
    seats: int


def calculate_usage_cost(usage: BillingUsage) -> int:
    """Returns billable amount in pence."""
    return int((usage.api_calls * 0.02) + (usage.tokens * 0.001) + (usage.seats * 1200))


def plan_catalog() -> dict[str, str]:
    return {
        "entry": "£47/mo",
        "mid_tier": "£12k–£18k modules",
        "high_ticket": "£25k–£35k consulting",
    }
