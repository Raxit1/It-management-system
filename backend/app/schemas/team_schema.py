from pydantic import BaseModel


class TeamCreate(BaseModel):

    name: str

    department: str

    leader_name: str


class TeamResponse(BaseModel):

    id: int

    name: str

    department: str

    leader_name: str

    company_id: int

    class Config:

        from_attributes = True