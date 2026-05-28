import os

from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    Form,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database import SessionLocal

from app.models.document_model import Document

from app.schemas.document_schema import (
    DocumentResponse
)

from app.auth import get_current_user

from app.role_checker import require_role


router = APIRouter()

UPLOAD_FOLDER = "uploads"


# DATABASE CONNECTION
def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


# UPLOAD DOCUMENT
@router.post(
    "/documents",
    response_model=DocumentResponse
)
def upload_document(

    project_name: str = Form(...),

    file: UploadFile = File(...),

    current_user: dict = Depends(
        require_role("admin")
    ),

    db: Session = Depends(get_db)
):

    # CREATE FILENAME
    file_location = f"{UPLOAD_FOLDER}/{file.filename}"

    # SAVE FILE
    with open(file_location, "wb") as f:

        f.write(file.file.read())

    # SAVE DATABASE
    new_document = Document(

        filename=file.filename,

        filepath=file_location,

        project_name=project_name,

        company_id=
            current_user["company_id"]
    )

    db.add(new_document)

    db.commit()

    db.refresh(new_document)

    return new_document


# GET DOCUMENTS
@router.get(
    "/documents",
    response_model=list[DocumentResponse]
)
def get_documents(

    current_user: dict = Depends(
        get_current_user
    ),

    db: Session = Depends(get_db)
):

    documents = db.query(Document).filter(

        Document.company_id ==

        current_user["company_id"]

    ).all()

    return documents


# DELETE DOCUMENT
@router.delete(
    "/documents/{document_id}"
)
def delete_document(

    document_id: int,

    current_user: dict = Depends(
        require_role("admin")
    ),

    db: Session = Depends(get_db)
):

    document = db.query(Document).filter(

        Document.id == document_id

    ).first()

    if not document:

        raise HTTPException(

            status_code=404,

            detail="Document not found"
        )

    # SECURITY
    if document.company_id != current_user["company_id"]:

        raise HTTPException(

            status_code=403,

            detail="Access denied"
        )

    # DELETE FILE
    if os.path.exists(document.filepath):

        os.remove(document.filepath)

    db.delete(document)

    db.commit()

    return {

        "message":
            "Document deleted successfully"
    }