from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey
)

from app.database import Base


class Candidate(Base):

    __tablename__ = "candidates"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        nullable=False
    )

    skills = Column(
        String
    )

    experience = Column(
        String
    )

    resume = Column(
        String
    )

    status = Column(
        String,
        default="Pending"
    )

    rating = Column(
        Integer,
        default=0
    )

    company_id = Column(
        Integer,
        ForeignKey("companies.id")
    )