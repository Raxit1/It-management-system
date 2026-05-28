from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import SessionLocal
from app.models.user import User
from app.models.company_model import Company
from app.role_checker import require_role
from app.schemas.user_schema import RegisterSchema, LoginSchema
from app.security import (
    hash_password,
    verify_password,
    create_access_token
)

router = APIRouter()

# DATABASE CONNECTION
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# REGISTER API
@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: RegisterSchema, db: Session = Depends(get_db)):
    # CHECK EMAIL EXISTS
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # CHECK COMPANY EXISTS
    company = db.query(Company).filter(Company.id == user.company_id).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    # CREATE USER
    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        role=user.role,
        company_id=user.company_id
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully"}

# LOGIN API
@router.post("/login")
def login(user: LoginSchema, db: Session = Depends(get_db)):
    # FIND COMPANY
    company = db.query(Company).filter(Company.company_code == user.company_code).first()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    # FIND USER
    db_user = db.query(User).filter(
        User.email == user.email,
        User.company_id == company.id
    ).first()

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid Email")

    # VERIFY PASSWORD
    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid Password")

    # CREATE ACCESS TOKEN (Injects vital tenant information fields)
    token = create_access_token({
        "user_id": db_user.id,
        "email": db_user.email,
        "role": db_user.role,
        "company_id": db_user.company_id
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }

# PROFILE API (PROTECTED)
@router.get("/profile")
def profile(current_user: dict = Depends(get_current_user)):
    return {
        "message": "Protected route accessed",
        "user": current_user
    }

# ADMIN DASHBOARD (ROLE PROTECTED)
@router.get("/admin-dashboard")
def admin_dashboard(current_user: dict = Depends(require_role("admin"))):
    return {
        "message": "Welcome Manager",
        "user": current_user
    }