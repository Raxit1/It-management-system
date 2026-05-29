from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base

# Clean Router Imports
from app.routes.user_routes import router as user_router
from app.routes.company_routes import router as company_router
from app.routes.employee_routes import router as employee_router
from app.routes.project_routes import router as project_router 
from app.routes.task_routes import router as task_router
from app.routes.client_routes import router as client_router
from app.routes.team_routes import router as team_router
from app.routes.document_routes import router as document_router
from app.routes.chat_routes import router as chat_router
from app.routes.candidate_routes import router as candidate_router
from app.routes.analytics_routes import router as analytics_router
from app.routes.activity_routes import router as activity_router
from app.routes.otp_routes import router as otp_router
from app.routes.dashboard_routes import router as dashboard_router


# 1. EXPLICITLY IMPORT ALL CENTRAL MODELS TO ENSURE TRACKING
from app.models.company_model import Company
from app.models.user import User

# DIAGNOSTIC PRINT: See exactly what tables SQLAlchemy knows about right now
print("SQLAlchemy tracked tables:", Base.metadata.tables.keys())

# Automatically create SQL tables based on SQLAlchemy Models
@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

app = FastAPI(title="IT Management Enterprise System API")

# Global Security Middleware Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Explicit Register Order Table Injection
app.include_router(user_router)
app.include_router(company_router)
app.include_router(employee_router)
app.include_router(project_router)
app.include_router(task_router)
app.include_router(client_router)
app.include_router(team_router)
app.include_router(document_router)
app.include_router(chat_router)
app.include_router(candidate_router)
app.include_router(analytics_router)  
app.include_router(activity_router)
app.include_router(otp_router)
app.include_router(dashboard_router)

@app.get("/")
def home():
    return {"message": "IT Management System API Running Cleanly"}