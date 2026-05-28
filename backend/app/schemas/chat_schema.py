from pydantic import BaseModel


class ChatCreate(BaseModel):

    message: str


class ChatResponse(BaseModel):

    id: int

    sender: str

    message: str

    company_id: int

    class Config:

        from_attributes = True