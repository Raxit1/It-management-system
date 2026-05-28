from pydantic import BaseModel, EmailStr

class EmployeeCreate(BaseModel):
    name: str
    email: EmailStr
    department: str
    position: str
    salary: float  # Matches SQLAlchemy Float exactly

class EmployeeResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    department: str
    position: str
    salary: float
    company_id: int

    class Config:
        from_attributes = True