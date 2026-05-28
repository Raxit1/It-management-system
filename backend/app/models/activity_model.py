from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    ForeignKey
)

from datetime import datetime

from app.database import Base


class ActivityLog(Base):

    __tablename__ = "activity_logs"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_email = Column(
        String,
        nullable=False
    )

    action = Column(
        String,
        nullable=False
    )

    module = Column(
        String
    )

    timestamp = Column(
        DateTime,
        default=datetime.utcnow
    )

    company_id = Column(
        Integer,
        ForeignKey("companies.id")
    )