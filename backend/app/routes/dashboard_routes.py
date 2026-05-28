from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.auth import get_current_user

from app.models.employee_model import Employee
from app.models.project_model import Project
from app.models.task import Task

router = APIRouter()


# DATABASE
def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# DASHBOARD STATS
@router.get("/dashboard-stats")
def dashboard_stats(

    current_user: dict = Depends(
        get_current_user
    ),

    db: Session = Depends(get_db)
):

    company_id = current_user["company_id"]

    total_employees = db.query(Employee).filter(

        Employee.company_id == company_id

    ).count()

    total_projects = db.query(Project).filter(

        Project.company_id == company_id

    ).count()

    total_tasks = db.query(Task).filter(

        Task.company_id == company_id

    ).count()

    completed_tasks = db.query(Task).filter(

        Task.company_id == company_id,

        Task.status == "Completed"

    ).count()

    pending_tasks = db.query(Task).filter(

        Task.company_id == company_id,

        Task.status == "Pending"

    ).count()

    return {

        "employees": total_employees,

        "projects": total_projects,

        "tasks": total_tasks,

        "completed": completed_tasks,

        "pending": pending_tasks
    }