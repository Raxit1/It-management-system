from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)

from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.models.project_model import Project

from app.schemas.project_schema import (
    ProjectCreate,
    ProjectResponse
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


# CREATE PROJECT
@router.post(
    "/projects",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED
)
def create_project(

    project: ProjectCreate,

    current_user: dict = Depends(
        require_role("admin")
    ),

    db: Session = Depends(get_db)
):

    new_project = Project(

        name=project.name,

        description=project.description,

        status=project.status,

        company_id=
            current_user["company_id"]
    )

    db.add(new_project)

    db.commit()

    db.refresh(new_project)

    return new_project


# GET ALL PROJECTS
@router.get(
    "/projects",
    response_model=list[ProjectResponse]
)
def get_projects(

    current_user: dict = Depends(
        get_current_user
    ),

    db: Session = Depends(get_db)
):

    projects = db.query(Project).filter(

        Project.company_id ==

        current_user["company_id"]

    ).all()

    return projects


# UPDATE PROJECT
@router.put(
    "/projects/{project_id}",
    response_model=ProjectResponse
)
def update_project(

    project_id: int,

    project: ProjectCreate,

    current_user: dict = Depends(
        require_role("admin")
    ),

    db: Session = Depends(get_db)
):

    existing_project = db.query(Project).filter(

        Project.id == project_id

    ).first()

    if not existing_project:

        raise HTTPException(

            status_code=404,

            detail="Project not found"
        )

    # COMPANY SECURITY
    if existing_project.company_id != current_user["company_id"]:

        raise HTTPException(

            status_code=403,

            detail="Access denied"
        )

    existing_project.name = project.name

    existing_project.description = project.description

    existing_project.status = project.status

    db.commit()

    db.refresh(existing_project)

    return existing_project


# DELETE PROJECT
@router.delete(
    "/projects/{project_id}"
)
def delete_project(

    project_id: int,

    current_user: dict = Depends(
        require_role("admin")
    ),

    db: Session = Depends(get_db)
):

    project = db.query(Project).filter(

        Project.id == project_id

    ).first()

    if not project:

        raise HTTPException(

            status_code=404,

            detail="Project not found"
        )

    # COMPANY SECURITY
    if project.company_id != current_user["company_id"]:

        raise HTTPException(

            status_code=403,

            detail="Access denied"
        )

    db.delete(project)

    db.commit()

    return {

        "message":
            "Project deleted successfully"
    }