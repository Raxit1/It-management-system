from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.models.team_model import Team

from app.schemas.team_schema import (
    TeamCreate,
    TeamResponse
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


# CREATE TEAM
@router.post(
    "/teams",
    response_model=TeamResponse
)
def create_team(

    team: TeamCreate,

    current_user: dict = Depends(
        require_role("admin")
    ),

    db: Session = Depends(get_db)
):

    new_team = Team(

        name=team.name,

        department=team.department,

        leader_name=team.leader_name,

        company_id=
            current_user["company_id"]
    )

    db.add(new_team)

    db.commit()

    db.refresh(new_team)

    return new_team


# GET TEAMS
@router.get(
    "/teams",
    response_model=list[TeamResponse]
)
def get_teams(

    current_user: dict = Depends(
        get_current_user
    ),

    db: Session = Depends(get_db)
):

    teams = db.query(Team).filter(

        Team.company_id ==

        current_user["company_id"]

    ).all()

    return teams


# UPDATE TEAM
@router.put(
    "/teams/{team_id}",
    response_model=TeamResponse
)
def update_team(

    team_id: int,

    team: TeamCreate,

    current_user: dict = Depends(
        require_role("admin")
    ),

    db: Session = Depends(get_db)
):

    existing_team = db.query(Team).filter(

        Team.id == team_id

    ).first()

    if not existing_team:

        raise HTTPException(

            status_code=404,

            detail="Team not found"
        )

    if existing_team.company_id != current_user["company_id"]:

        raise HTTPException(

            status_code=403,

            detail="Access denied"
        )

    existing_team.name = team.name

    existing_team.department = team.department

    existing_team.leader_name = team.leader_name

    db.commit()

    db.refresh(existing_team)

    return existing_team


# DELETE TEAM
@router.delete(
    "/teams/{team_id}"
)
def delete_team(

    team_id: int,

    current_user: dict = Depends(
        require_role("admin")
    ),

    db: Session = Depends(get_db)
):

    team = db.query(Team).filter(

        Team.id == team_id

    ).first()

    if not team:

        raise HTTPException(

            status_code=404,

            detail="Team not found"
        )

    if team.company_id != current_user["company_id"]:

        raise HTTPException(

            status_code=403,

            detail="Access denied"
        )

    db.delete(team)

    db.commit()

    return {

        "message":
            "Team deleted successfully"
    }