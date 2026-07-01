from fastapi import FastAPI
from app.api.routes.resume import router as resume_router
from app.core.database import Base, engine
from app.models.analysis import ResumeAnalysis

app = FastAPI(
    title="ResumeIQ API",
    description="AI-powered Resume Analyzer",
    version="1.0.0",
)
Base.metadata.create_all(bind=engine)

app.include_router(resume_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to ResumeIQ 🚀"
    }