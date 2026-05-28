from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.auth import get_current_user
from app.models.employee_model import Employee
from app.models.project_model import Project
from app.models.task import Task
from app.models.client_model import Client
from app.models.team_model import Team

router = APIRouter()

# DATABASE CONNECTION
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# FAIL-SAFE ANALYTICS API
@router.get("/analytics")
def get_analytics(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    company_id = current_user.get("company_id", 1)

    # 1. Safe Employee Count
    try:
        employee_count = db.query(Employee).filter(Employee.company_id == company_id).count()
    except Exception as e:
        print(f"[Analytics Warning] Employee count failed, falling back: {e}")
        try:
            employee_count = db.query(Employee).count()
        except Exception:
            employee_count = 0

    # 2. Safe Project Count
    try:
        project_count = db.query(Project).filter(Project.company_id == company_id).count()
    except Exception as e:
        print(f"[Analytics Warning] Project count failed, falling back: {e}")
        try:
            project_count = db.query(Project).count()
        except Exception:
            project_count = 0

    # 3. Safe Client Count
    try:
        client_count = db.query(Client).filter(Client.company_id == company_id).count()
    except Exception as e:
        print(f"[Analytics Warning] Client count failed, falling back: {e}")
        try:
            client_count = db.query(Client).count()
        except Exception:
            client_count = 0

    # 4. Safe Team Count
    try:
        team_count = db.query(Team).filter(Team.company_id == company_id).count()
    except Exception as e:
        print(f"[Analytics Warning] Team count failed, falling back: {e}")
        try:
            team_count = db.query(Team).count()
        except Exception:
            team_count = 0

    # 5. Safe Tasks Count & Analytics Breakdown
    completed_tasks = 0
    pending_tasks = 0
    total_tasks = 0
    
    try:
        completed_tasks = db.query(Task).filter(Task.company_id == company_id, Task.status == "Completed").count()
        pending_tasks = db.query(Task).filter(Task.company_id == company_id, Task.status.in_(["Pending", "Todo", "In Progress"])).count()
        total_tasks = db.query(Task).filter(Task.company_id == company_id).count()
    except Exception as e:
        print(f"[Analytics Warning] Multi-tenant Task queries failed, falling back: {e}")
        try:
            completed_tasks = db.query(Task).filter(Task.status == "Completed").count()
            pending_tasks = db.query(Task).filter(Task.status.in_(["Pending", "Todo", "In Progress"])).count()
            total_tasks = db.query(Task).count()
        except Exception:
            pass

    # Calculation logic
    completion_rate = 0
    if total_tasks > 0:
        completion_rate = (completed_tasks / total_tasks) * 100

    risk_level = "Low"
    if pending_tasks > completed_tasks:
        risk_level = "High"
    elif pending_tasks > 5:
        risk_level = "Medium"

    return {
        "employees": employee_count,
        "projects": project_count,
        "clients": client_count,
        "teams": team_count,
        "completed_tasks": completed_tasks,
        "pending_tasks": pending_tasks,
        "completion_rate": round(completion_rate, 2),
        "risk_level": risk_level
    }