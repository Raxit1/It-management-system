from pydantic import BaseModel, EmailStr
from typing import Optional

class CompanyCreate(BaseModel):
    company_name: str
    company_code: str    # Added to satisfy the model column constraints
    company_email: EmailStr

class CompanyResponse(BaseModel):
    id: int
    company_name: str
    company_code: str
    company_email: str
    company_logo: Optional[str] = None

    class Config:
        from_attributes = True