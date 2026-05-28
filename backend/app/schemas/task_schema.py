from pydantic import BaseModel
from typing import Optional
from datetime import date

# What the API expects from the frontend when creating a task
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = "Todo"
    priority: Optional[str] = "Medium"
    due_date: Optional[date] = None
    employee_id: int
    project_id: int

# What the API expects when updating a task status
class TaskUpdateSchema(BaseModel):
    status: str

# What the API returns back to the React Frontend (Bulletproof Validation)
class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = "No description provided"
    status: Optional[str] = "Todo"
    priority: Optional[str] = "Medium"
    due_date: Optional[date] = None
    employee_id: Optional[int] = None
    project_id: Optional[int] = None
    company_id: int

    class Config:
        from_attributes = True  # Allows Pydantic to parse SQLAlchemy database models