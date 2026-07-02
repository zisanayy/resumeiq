from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.resume import router as resume_router
from app.core.database import Base, engine
from app.models.analysis import ResumeAnalysis

app = FastAPI(
    title="ResumeIQ API",
    description="AI-powered Resume Analyzer",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(resume_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to ResumeIQ 🚀"
    }