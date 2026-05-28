import random

from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from fastapi_mail import (
    FastMail,
    MessageSchema
)

from app.database import SessionLocal

from app.email_config import conf

from app.models.otp_model import OTP

from pydantic import BaseModel


router = APIRouter()


# DATABASE
def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# REQUEST MODEL
class EmailSchema(BaseModel):

    email: str


# VERIFY MODEL
class VerifySchema(BaseModel):

    email: str

    otp: str


# SEND OTP
@router.post("/send-otp")
async def send_otp(

    data: EmailSchema,

    db: Session = Depends(get_db)
):

    otp_code = str(

        random.randint(100000, 999999)
    )

    # SAVE OTP
    otp_entry = OTP(

        email=data.email,

        otp=otp_code
    )

    db.add(otp_entry)

    db.commit()

    # EMAIL MESSAGE
    message = MessageSchema(

        subject="Your OTP Code",

        recipients=[data.email],

        body=f"Your OTP is: {otp_code}",

        subtype="plain"
    )

    fm = FastMail(conf)

    await fm.send_message(message)

    return {

        "message":
            "OTP sent successfully"
    }


# VERIFY OTP
@router.post("/verify-otp")
def verify_otp(

    data: VerifySchema,

    db: Session = Depends(get_db)
):

    otp_record = db.query(OTP).filter(

        OTP.email == data.email,

        OTP.otp == data.otp

    ).first()

    if not otp_record:

        raise HTTPException(

            status_code=400,

            detail="Invalid OTP"
        )

    db.delete(otp_record)

    db.commit()

    return {

        "message":
            "OTP verified successfully"
    }