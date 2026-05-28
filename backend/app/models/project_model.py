from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship


from sqlalchemy import ForeignKey
from sqlalchemy import Date
from app.database import Base
start_date = Column(Date)

end_date = Column(Date)

progress = Column(Integer)

class Project(Base):

    __tablename__ = "projects"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    description = Column(
        String,
        nullable=False
    )

    status = Column(
        String,
        default="Active"
    )
    company_id = Column(
    Integer,
    ForeignKey("companies.id")
)
    
    # RELATIONSHIP WITH TASKS
    tasks = relationship(
    "Task",
    back_populates="project",
    cascade="all, delete"
)