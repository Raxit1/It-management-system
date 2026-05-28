from pydantic import BaseModel
from datetime import date

class ProjectCreate(BaseModel):

    name: str
    description: str
    status: str

    start_date: date
    end_date: date

    progress: int


class ProjectResponse(BaseModel):

    id: int

    name: str

    description: str

    status: str

    class Config:

        from_attributes = True