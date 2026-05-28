from pydantic import BaseModel


class DocumentResponse(BaseModel):

    id: int

    filename: str

    filepath: str

    project_name: str

    company_id: int

    class Config:

        from_attributes = True