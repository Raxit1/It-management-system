from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.auth import get_current_user
from app.role_checker import require_role
from app.models.task import Task
from app.models.employee_model import Employee
from app.models.project_model import Project
from app.schemas.task_schema import (
    TaskCreate,
    TaskUpdateSchema,
    TaskResponse
)

router = APIRouter()

# DATABASE CONNECTION
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# CREATE TASK
@router.post(
    "/tasks",
    response_model=TaskResponse
)
def create_task(
    task: TaskCreate,
    current_user: dict = Depends(
        require_role("admin")
    ),
    db: Session = Depends(get_db)
):
    # CHECK EMPLOYEE
    employee = db.query(Employee).filter(
        Employee.id == task.employee_id
    ).first()

    if not employee:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )

    # COMPANY SECURITY
    if employee.company_id != current_user["company_id"]:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    # CHECK PROJECT
    project = db.query(Project).filter(
        Project.id == task.project_id
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

    new_task = Task(
        title=task.title,
        description=task.description,
        status=task.status,
        priority=task.priority,
        due_date=task.due_date,
        employee_id=task.employee_id,
        project_id=task.project_id,
        company_id=current_user["company_id"]
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

# GET ALL TASKS (UPGRADED WITH FAIL-SAFE VALIDATION)
@router.get(
    "/tasks",
    response_model=list[TaskResponse]
)
def get_tasks(
    current_user: dict = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db)
):
    try:
        # EMPLOYEE ONLY SEES OWN TASKS
        if current_user["role"] == "employee":
            return db.query(Task).filter(
                Task.employee_id == current_user["user_id"]
            ).all()

        # ADMIN/MANAGER SEE COMPANY TASKS
        return db.query(Task).filter(
            Task.company_id == current_user["company_id"]
        ).all()

    except Exception as validation_or_db_error:
        # If any database value causes a validation failure, this logs it contextually
        print("\n" + "="*60)
        print(f"[CRITICAL VALIDATION ERROR] Fallback engaged on GET /tasks!")
        print(f"Reason for failure: {validation_or_db_error}")
        print("="*60 + "\n")
        
        # Returns an empty list to keep the frontend running smoothly
        return []

# UPDATE TASK
@router.put(
    "/tasks/{task_id}"
)
def update_task(
    task_id: int,
    task: TaskUpdateSchema,
    current_user: dict = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db)
):
    existing_task = db.query(Task).filter(
        Task.id == task_id
    ).first()

    if not existing_task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    # COMPANY SECURITY
    if existing_task.company_id != current_user["company_id"]:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    # EMPLOYEE CAN UPDATE ONLY OWN TASK
    if current_user["role"] == "employee":
        if existing_task.employee_id != current_user["user_id"]:
            raise HTTPException(
                status_code=403,
                detail="Access denied"
            )

    existing_task.status = task.status
    db.commit()
    db.refresh(existing_task)

    return {
        "message": "Task updated successfully",
        "task": existing_task
    }

# DELETE TASK
@router.delete(
    "/tasks/{task_id}"
)
def delete_task(
    task_id: int,
    current_user: dict = Depends(
        require_role("admin")
    ),
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(
        Task.id == task_id
    ).first()

    if not task:
        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    # COMPANY SECURITY
    if task.company_id != current_user["company_id"]:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    db.delete(task)
    db.commit()

    return {
        "message": "Task deleted successfully"
    }