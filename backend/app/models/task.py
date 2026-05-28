from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship

from app.database import Base
from sqlalchemy import ForeignKey

class Task(Base):

    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String, nullable=False)

    description = Column(String)

    status = Column(String, default="Pending")

    priority = Column(String, default="Medium")

    due_date = Column(Date)

    employee_id = Column(
        Integer,
        ForeignKey("employees.id")
    )

    project_id = Column(
        Integer,
        ForeignKey("projects.id")
    )

    # RELATIONSHIP
    employee = relationship(
        "Employee",
        back_populates="tasks"
    )

    project = relationship(
        "Project",
        back_populates="tasks"
    )
    company_id = Column(
    Integer,
    ForeignKey("companies.id")
)