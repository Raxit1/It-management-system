from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.company_model import Company
from app.schemas.company_schema import CompanyCreate, CompanyResponse

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/companies", response_model=CompanyResponse, status_code=status.HTTP_201_CREATED)
def create_company(company: CompanyCreate, db: Session = Depends(get_db)):
    # Prevent duplicate company codes from throwing unhandled server loops
    existing_code = db.query(Company).filter(Company.company_code == company.company_code).first()
    if existing_code:
        raise HTTPException(
            status_code=400,
            detail=f"Company with code '{company.company_code}' already exists."
        )

    # Map parameters using EXACT matching model column keywords
    new_company = Company(
        company_name=company.company_name,
        company_code=company.company_code,
        company_email=company.company_email,
        company_logo=None  # Can be uploaded or modified via an edit route later
    )

    db.add(new_company)
    db.commit()
    db.refresh(new_company)
    return new_company