from sqlalchemy import Column, Integer, String
from app.database import Base

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, nullable=False)
    company_code = Column(String, unique=True, nullable=False)
    company_email = Column(String, nullable=False)
    company_logo = Column(String, nullable=True)