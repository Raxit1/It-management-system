from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.models.chat_model import Chat

from app.schemas.chat_schema import (
    ChatCreate,
    ChatResponse
)

from app.auth import get_current_user


router = APIRouter()


# DATABASE CONNECTION
def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# SEND MESSAGE
@router.post(
    "/chat",
    response_model=ChatResponse
)
def send_message(

    chat: ChatCreate,

    current_user: dict = Depends(
        get_current_user
    ),

    db: Session = Depends(get_db)
):

    new_chat = Chat(

        sender=current_user["email"],

        message=chat.message,

        company_id=
            current_user["company_id"]
    )

    db.add(new_chat)

    db.commit()

    db.refresh(new_chat)

    return new_chat


# GET CHAT
@router.get(
    "/chat",
    response_model=list[ChatResponse]
)
def get_chat(

    current_user: dict = Depends(
        get_current_user
    ),

    db: Session = Depends(get_db)
):

    chats = db.query(Chat).filter(

        Chat.company_id ==

        current_user["company_id"]

    ).all()

    return chats