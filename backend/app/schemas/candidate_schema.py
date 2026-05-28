from pydantic import BaseModel


class CandidateCreate(BaseModel):

    name: str

    email: str

    skills: str

    experience: str

    resume: str


class CandidateUpdate(BaseModel):

    status: str

    rating: int


class CandidateResponse(BaseModel):

    id: int

    name: str

    email: str

    skills: str

    experience: str

    resume: str

    status: str

    rating: int

    company_id: int

    class Config:

        from_attributes = True