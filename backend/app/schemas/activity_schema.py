from pydantic import BaseModel

from datetime import datetime


class ActivityResponse(BaseModel):

    id: int

    user_email: str

    action: str

    module: str

    timestamp: datetime

    company_id: int

    class Config:

        from_attributes = True  