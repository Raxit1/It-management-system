from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from typing import Optional
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext

# Import your shared configurations
from app.database import SessionLocal
from app.models.user import User  # Adjust path to your actual User model file
from app.security import SECRET_KEY, ALGORITHM

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- PYDANTIC SCHEMAS ---
class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: Optional[str] = "admin"  
    company_id: Optional[int] = 1  

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    company_id: int

    class Config:
        from_attributes = True

# Database Helper Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- UTILITY HELPERS ---
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=60)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# --- ROUTE 1: REGISTER NEW USER ---
@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(user_data: UserRegister, db: Session = Depends(get_db)):
    user_exists = db.query(User).filter(
        (User.email == user_data.email) | (User.username == user_data.username)
    ).first()
    
    if user_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or Email already registered"
        )
        
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=pwd_context.hash(user_data.password),
        role=user_data.role,
        company_id=user_data.company_id
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# --- ROUTE 2: LOGIN & ISSUE TOKEN ---
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not pwd_context.verify(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
        
    # Inject all fields required by get_current_user into the JWT token
    access_token = create_access_token(
        data={
            "user_id": user.id,
            "email": user.email,
            "role": user.role,
            "company_id": user.company_id
        }
    )
    return {"access_token": access_token, "token_type": "bearer"}

# --- EXPORTED CURRENT USER DEPENDENCY ---
def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid token"
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        email = payload.get("email")
        role = payload.get("role")
        company_id = payload.get("company_id")
        
        if user_id is None:
            raise credentials_exception
            
        return {
            "user_id": user_id,
            "email": email,
            "role": role,
            "company_id": company_id
        }
    except JWTError:
        raise credentials_exception