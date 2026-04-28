from sqlalchemy import JSON, Boolean, Column, DateTime, Integer, String, Text
from sqlalchemy.sql import func

from app.core.database import Base


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    company = Column(String(255), nullable=True)
    message = Column(Text, nullable=True)
    source_page = Column(String(255), nullable=False, index=True)
    lifecycle_status = Column(String(50), nullable=False, default="new", index=True)
    consent = Column(Boolean, nullable=False, default=False)
    qualification_metadata = Column(JSON, nullable=False, default=dict)
    subscription_customer_id = Column(String(255), nullable=True, index=True)
    payment_status = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
