from pydantic import BaseModel, EmailStr

class RegisterSchema(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str
    company_id: int

class LoginSchema(BaseModel):
    company_code: str
    email: EmailStr
    password: str