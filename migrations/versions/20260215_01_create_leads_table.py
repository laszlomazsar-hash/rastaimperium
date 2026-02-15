"""create leads table

Revision ID: 20260215_01
Revises:
Create Date: 2026-02-15 00:00:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "20260215_01"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "leads",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("full_name", sa.String(length=255), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("company", sa.String(length=255), nullable=True),
        sa.Column("message", sa.Text(), nullable=True),
        sa.Column("source_page", sa.String(length=255), nullable=False),
        sa.Column("lifecycle_status", sa.String(length=50), nullable=False, server_default="new"),
        sa.Column("consent", sa.Boolean(), nullable=False),
        sa.Column("qualification_metadata", sa.JSON(), nullable=False, server_default=sa.text("'{}'::json")),
        sa.Column("subscription_customer_id", sa.String(length=255), nullable=True),
        sa.Column("payment_status", sa.String(length=50), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_leads_email"), "leads", ["email"], unique=False)
    op.create_index(op.f("ix_leads_id"), "leads", ["id"], unique=False)
    op.create_index(op.f("ix_leads_lifecycle_status"), "leads", ["lifecycle_status"], unique=False)
    op.create_index(op.f("ix_leads_source_page"), "leads", ["source_page"], unique=False)
    op.create_index(
        op.f("ix_leads_subscription_customer_id"),
        "leads",
        ["subscription_customer_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_leads_subscription_customer_id"), table_name="leads")
    op.drop_index(op.f("ix_leads_source_page"), table_name="leads")
    op.drop_index(op.f("ix_leads_lifecycle_status"), table_name="leads")
    op.drop_index(op.f("ix_leads_id"), table_name="leads")
    op.drop_index(op.f("ix_leads_email"), table_name="leads")
    op.drop_table("leads")
