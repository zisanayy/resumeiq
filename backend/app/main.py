from fastapi import FastAPI
from app.api.routes.resume import router as resume_router

app = FastAPI(
    title="ResumeIQ API",
    description="AI-powered Resume Analyzer",
    version="1.0.0",
)

app.include_router(resume_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to ResumeIQ 🚀"
    }