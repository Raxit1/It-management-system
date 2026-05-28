from pydantic import BaseModel, EmailStr
from typing import Optional

# What the API expects when creating/updating a client record
class ClientCreate(BaseModel):
    name: str
    company_name: str
    email: EmailStr
    phone: str
    address: Optional[str] = None

# What the API sends back to your React app (Bulletproof Validation)
class ClientResponse(BaseModel):
    id: int
    name: str
    company_name: Optional[str] = "N/A"  # Fallback to string if database row is NULL
    email: str
    phone: str
    address: Optional[str] = "N/A"       # Fallback to string if database row is NULL
    company_id: int

    class Config:
        from_attributes = True