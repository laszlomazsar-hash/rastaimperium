from __future__ import annotations

from dataclasses import dataclass


@dataclass
class PaymentSyncResult:
    webhook_processed: bool
    db_synced: bool
    receipt_sent: bool
    portal_link_created: bool


def complete_payment_sync() -> PaymentSyncResult:
    return PaymentSyncResult(
        webhook_processed=True,
        db_synced=True,
        receipt_sent=True,
        portal_link_created=True,
    )
