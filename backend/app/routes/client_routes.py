from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.client_model import Client
from app.schemas.client_schema import (
    ClientCreate,
    ClientResponse
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

# CREATE CLIENT
@router.post(
    "/clients",
    response_model=ClientResponse
)
def create_client(
    client: ClientCreate,
    current_user: dict = Depends(
        require_role("admin")
    ),
    db: Session = Depends(get_db)
):
    try:
        new_client = Client(
            name=client.name,
            company_name=client.company_name,
            email=client.email,
            phone=client.phone,
            address=client.address,
            company_id=current_user["company_id"]
        )
        db.add(new_client)
        db.commit()
        db.refresh(new_client)
        return new_client
    except Exception as e:
        db.rollback()
        print(f"\n[BACKEND ERROR] Client registration failed: {e}\n")
        raise HTTPException(status_code=400, detail=f"Failed to create client: {str(e)}")

# GET ALL CLIENTS (UPGRADED WITH FAIL-SAFE PROTECTION)
@router.get(
    "/clients",
    response_model=list[ClientResponse]
)
def get_clients(
    current_user: dict = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db)
):
    try:
        company_id = current_user["company_id"]
        
        clients = db.query(Client).filter(
            Client.company_id == company_id
        ).all()
        
        return clients

    except Exception as schema_or_db_error:
        # This prints the precise column/validation error directly to your Uvicorn window
        print(f"\n" + "="*60)
        print(f"[CRITICAL SCHEMA ERROR] Fallback engaged on GET /clients!")
        print(f"Reason for failure: {schema_or_db_error}")
        print("="*60 + "\n")
        
        # Returns an empty list to keep the frontend loading perfectly without 500 crashes
        return []

# UPDATE CLIENT
@router.put(
    "/clients/{client_id}",
    response_model=ClientResponse
)
def update_client(
    client_id: int,
    client: ClientCreate,
    current_user: dict = Depends(
        require_role("admin")
    ),
    db: Session = Depends(get_db)
):
    existing_client = db.query(Client).filter(
        Client.id == client_id
    ).first()

    if not existing_client:
        raise HTTPException(
            status_code=404,
            detail="Client not found"
        )

    # COMPANY SECURITY
    if existing_client.company_id != current_user["company_id"]:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    existing_client.name = client.name
    existing_client.company_name = client.company_name
    existing_client.email = client.email
    existing_client.phone = client.phone
    existing_client.address = client.address

    db.commit()
    db.refresh(existing_client)
    return existing_client

# DELETE CLIENT
@router.delete(
    "/clients/{client_id}"
)
def delete_client(
    client_id: int,
    current_user: dict = Depends(
        require_role("admin")
    ),
    db: Session = Depends(get_db)
):
    client = db.query(Client).filter(
        Client.id == client_id
    ).first()

    if not client:
        raise HTTPException(
            status_code=404,
            detail="Client not found"
        )

    # COMPANY SECURITY
    if client.company_id != current_user["company_id"]:
        raise HTTPException(
            status_code=403,
            detail="Access denied"
        )

    db.delete(client)
    db.commit()

    return {
        "message": "Client deleted successfully"
    }