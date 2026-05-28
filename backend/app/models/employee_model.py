from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship

from app.database import Base
from sqlalchemy import ForeignKey

class Employee(Base):

    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    email = Column(String, unique=True, nullable=False)

    department = Column(String, nullable=False)

    position = Column(String, nullable=False)

    salary = Column(Float, nullable=False)
        
    # RE    LATIONSHIP
    tasks = relationship(
        "Task",
        back_populates="employee",
        cascade="all, delete"
    )
    company_id = Column(
    Integer,
    ForeignKey("companies.id")
)