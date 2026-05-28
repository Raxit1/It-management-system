from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.auth import get_current_user

from app.models.activity_model import (
    ActivityLog
)

from app.schemas.activity_schema import (
    ActivityResponse
)


router = APIRouter()


# DATABASE CONNECTION
def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# GET ACTIVITY LOGS
@router.get(
    "/activity-logs",
    response_model=list[ActivityResponse]
)
def get_logs(

    current_user: dict = Depends(
        get_current_user
    ),

    db: Session = Depends(get_db)
):

    logs = db.query(ActivityLog).filter(

        ActivityLog.company_id ==

        current_user["company_id"]

    ).order_by(

        ActivityLog.timestamp.desc()

    ).all()

    return logs