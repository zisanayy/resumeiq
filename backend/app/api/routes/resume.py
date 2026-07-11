from fastapi import APIRouter, UploadFile, File, HTTPException, Form, Depends
from sqlalchemy.orm import Session
import json

from app.services.skill_analyzer import extract_skills
from app.services.text_extractor import extract_text_from_file
from app.services.resume_analyzer import calculate_resume_score
from app.core.database import get_db
from app.models.analysis import ResumeAnalysis


router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)


@router.get("/")
def get_resume():
    return {
        "message": "Resume endpoint is working!"
    }


@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    allowed_types = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are allowed."
        )

    extracted_text = await extract_text_from_file(file)
    skills = extract_skills(extracted_text)
    analysis = calculate_resume_score(skills, extracted_text)

    normalized_skills = {
        skill.strip().lower()
        for skill in skills
    }

    suggestion_candidates = [
        ("Docker", "docker"),
        ("PostgreSQL", "postgresql"),
        ("AWS", "aws"),
        ("CI/CD", "ci/cd"),
        ("GitHub", "github"),
        ("Kubernetes", "kubernetes"),
    ]

    suggested_skills = [
        display_name
        for display_name, normalized_name in suggestion_candidates
        if normalized_name not in normalized_skills
    ]

    if analysis["score"] >= 80:
        overall_feedback = (
            "This resume demonstrates strong technical skills and a solid "
            "backend and AI profile. It is a strong candidate resume, "
            "especially for Python, FastAPI and machine learning related roles."
        )
    elif analysis["score"] >= 50:
        overall_feedback = (
            "This resume has a good foundation, but it can be improved by "
            "adding more technical skills, projects and measurable achievements."
        )
    else:
        overall_feedback = (
            "This resume needs improvement. Add more relevant skills, projects, "
            "experience details and stronger technical keywords."
        )

    analysis_record = ResumeAnalysis(
        filename=file.filename,
        content_type=file.content_type,
        text_length=len(extracted_text),
        detected_skills=json.dumps(skills),
        ats_score=analysis["score"],
        strengths=json.dumps(analysis["strengths"]),
        weaknesses=json.dumps(analysis["weaknesses"]),
        recommendations=json.dumps(analysis["recommendations"])
    )

    db.add(analysis_record)
    db.commit()
    db.refresh(analysis_record)

    return {
        "analysis_id": analysis_record.id,
        "filename": file.filename,
        "content_type": file.content_type,
        "text_length": len(extracted_text),
        "detected_skills": skills,
        "skills_count": len(skills),
        "ats_score": analysis["score"],
        "strengths": analysis["strengths"],
        "weaknesses": analysis["weaknesses"],
        "recommendations": analysis["recommendations"],
        "suggested_skills": suggested_skills,
        "overall_feedback": overall_feedback,
        "preview": extracted_text[:500],
        "message": "Resume analyzed and saved successfully."
    }


@router.post("/match-job")
async def match_resume_with_job(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    allowed_types = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]

    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are allowed."
        )

    extracted_text = await extract_text_from_file(file)

    resume_skills = extract_skills(extracted_text)
    job_skills = extract_skills(job_description)

    matched_skills = sorted(
        set(resume_skills).intersection(set(job_skills))
    )

    missing_skills = sorted(
        set(job_skills).difference(set(resume_skills))
    )

    if len(job_skills) == 0:
        match_percentage = 0
    else:
        match_percentage = round(
            (len(matched_skills) / len(job_skills)) * 100
        )

    recommendations = [
        f"Consider adding or improving your experience with {skill}."
        for skill in missing_skills
    ]

    return {
        "filename": file.filename,
        "resume_skills": resume_skills,
        "job_required_skills": job_skills,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "match_percentage": match_percentage,
        "recommendations": recommendations[:8],
        "message": "Resume matched with job description successfully."
    }


@router.get("/history")
def get_analysis_history(db: Session = Depends(get_db)):
    analyses = db.query(ResumeAnalysis).order_by(
        ResumeAnalysis.created_at.desc()
    ).all()

    history = []

    for analysis in analyses:
        history.append({
            "id": analysis.id,
            "filename": analysis.filename,
            "ats_score": analysis.ats_score,
            "created_at": analysis.created_at,
            "text_length": analysis.text_length
        })

    return {
        "total": len(history),
        "history": history
    }


@router.get("/history/{analysis_id}")
def get_analysis_by_id(
    analysis_id: int,
    db: Session = Depends(get_db)
):
    analysis = db.query(ResumeAnalysis).filter(
        ResumeAnalysis.id == analysis_id
    ).first()

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found."
        )

    return {
        "id": analysis.id,
        "filename": analysis.filename,
        "content_type": analysis.content_type,
        "text_length": analysis.text_length,
        "detected_skills": json.loads(analysis.detected_skills),
        "ats_score": analysis.ats_score,
        "strengths": json.loads(analysis.strengths),
        "weaknesses": json.loads(analysis.weaknesses),
        "recommendations": json.loads(analysis.recommendations),
        "created_at": analysis.created_at
    }


@router.delete("/history/{analysis_id}")
def delete_analysis(
    analysis_id: int,
    db: Session = Depends(get_db)
):
    analysis = db.query(ResumeAnalysis).filter(
        ResumeAnalysis.id == analysis_id
    ).first()

    if not analysis:
        raise HTTPException(
            status_code=404,
            detail="Analysis not found."
        )

    db.delete(analysis)
    db.commit()

    return {
        "message": "Analysis deleted successfully.",
        "deleted_id": analysis_id
    }