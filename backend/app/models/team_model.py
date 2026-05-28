from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey
)

from app.database import Base


class Team(Base):

    __tablename__ = "teams"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    department = Column(
        String,
        nullable=False
    )

    leader_name = Column(
        String
    )

    company_id = Column(
        Integer,
        ForeignKey("companies.id")
    )