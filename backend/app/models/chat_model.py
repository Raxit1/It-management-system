from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey
)

from app.database import Base


class Chat(Base):

    __tablename__ = "chats"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    sender = Column(
        String,
        nullable=False
    )

    message = Column(
        String,
        nullable=False
    )

    company_id = Column(
        Integer,
        ForeignKey("companies.id")
    )