from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.models.employee_model import Employee

from app.auth import get_current_user

from app.schemas.employee_schema import (
    EmployeeCreate,
    EmployeeResponse
)

from app.role_checker import require_role


router = APIRouter()


# DATABASE CONNECTION
def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# ADD EMPLOYEE
@router.post(
    "/employees",
    response_model=EmployeeResponse
)
def add_employee(

    employee: EmployeeCreate,

    current_user: dict = Depends(
        require_role("admin")
    ),

    db: Session = Depends(get_db)
):

    new_employee = Employee(

        name=employee.name,

        email=employee.email,

        department=employee.department,

        position=employee.position,

        salary=employee.salary,

        company_id=
            current_user["company_id"]
    )

    db.add(new_employee)

    db.commit()

    db.refresh(new_employee)

    return new_employee


# GET ALL EMPLOYEES
@router.get(
    "/employees",
    response_model=list[EmployeeResponse]
)
def get_employees(

    current_user: dict = Depends(
        get_current_user
    ),

    db: Session = Depends(get_db)
):

    employees = db.query(Employee).filter(

        Employee.company_id ==

        current_user["company_id"]

    ).all()

    return employees


# UPDATE EMPLOYEE
@router.put(
    "/employees/{employee_id}",
    response_model=EmployeeResponse
)
def update_employee(

    employee_id: int,

    employee: EmployeeCreate,

    current_user: dict = Depends(
        require_role("admin")
    ),

    db: Session = Depends(get_db)
):

    existing_employee = db.query(Employee).filter(

        Employee.id == employee_id

    ).first()

    if not existing_employee:

        raise HTTPException(

            status_code=404,

            detail="Employee not found"
        )

    # COMPANY SECURITY
    if existing_employee.company_id != current_user["company_id"]:

        raise HTTPException(

            status_code=403,

            detail="Access denied"
        )

    existing_employee.name = employee.name

    existing_employee.email = employee.email

    existing_employee.department = employee.department

    existing_employee.position = employee.position

    existing_employee.salary = employee.salary

    db.commit()

    db.refresh(existing_employee)

    return existing_employee


# DELETE EMPLOYEE
@router.delete(
    "/employees/{employee_id}"
)
def delete_employee(

    employee_id: int,

    current_user: dict = Depends(
        require_role("admin")
    ),

    db: Session = Depends(get_db)
):

    employee = db.query(Employee).filter(

        Employee.id == employee_id

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

    db.delete(employee)

    db.commit()

    return {

        "message":
            "Employee deleted successfully"
    }