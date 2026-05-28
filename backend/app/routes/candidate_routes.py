from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.models.candidate_model import Candidate

from app.schemas.candidate_schema import (
    CandidateCreate,
    CandidateUpdate,
    CandidateResponse
)

from app.auth import get_current_user

from app.role_checker import require_role


router = APIRouter()


# DATABASE CONNECTION
def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# CREATE CANDIDATE
@router.post(
    "/candidates",
    response_model=CandidateResponse
)
def create_candidate(

    candidate: CandidateCreate,

    current_user: dict = Depends(
        require_role("hr")
    ),

    db: Session = Depends(get_db)
):

    new_candidate = Candidate(

        name=candidate.name,

        email=candidate.email,

        skills=candidate.skills,

        experience=candidate.experience,

        resume=candidate.resume,

        company_id=
            current_user["company_id"]
    )

    db.add(new_candidate)

    db.commit()

    db.refresh(new_candidate)

    return new_candidate


# GET CANDIDATES
@router.get(
    "/candidates",
    response_model=list[CandidateResponse]
)
def get_candidates(

    current_user: dict = Depends(
        require_role("hr")
    ),

    db: Session = Depends(get_db)
):

    candidates = db.query(Candidate).filter(

        Candidate.company_id ==

        current_user["company_id"]

    ).all()

    return candidates


# UPDATE CANDIDATE
@router.put(
    "/candidates/{candidate_id}",
    response_model=CandidateResponse
)
def update_candidate(

    candidate_id: int,

    candidate: CandidateUpdate,

    current_user: dict = Depends(
        require_role("hr")
    ),

    db: Session = Depends(get_db)
):

    existing_candidate = db.query(Candidate).filter(

        Candidate.id == candidate_id

    ).first()

    if not existing_candidate:

        raise HTTPException(

            status_code=404,

            detail="Candidate not found"
        )

    if existing_candidate.company_id != current_user["company_id"]:

        raise HTTPException(

            status_code=403,

            detail="Access denied"
        )

    existing_candidate.status = candidate.status

    existing_candidate.rating = candidate.rating

    db.commit()

    db.refresh(existing_candidate)

    return existing_candidate


# DELETE CANDIDATE
@router.delete(
    "/candidates/{candidate_id}"
)
def delete_candidate(

    candidate_id: int,

    current_user: dict = Depends(
        require_role("hr")
    ),

    db: Session = Depends(get_db)
):

    candidate = db.query(Candidate).filter(

        Candidate.id == candidate_id

    ).first()

    if not candidate:

        raise HTTPException(

            status_code=404,

            detail="Candidate not found"
        )

    if candidate.company_id != current_user["company_id"]:

        raise HTTPException(

            status_code=403,

            detail="Access denied"
        )

    db.delete(candidate)

    db.commit()

    return {

        "message":
            "Candidate deleted successfully"
    }