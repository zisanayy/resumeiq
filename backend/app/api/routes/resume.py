from app.services.skill_analyzer import extract_skills
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.text_extractor import extract_text_from_file
from app.services.resume_analyzer import calculate_resume_score
from fastapi import APIRouter, UploadFile, File, HTTPException, Form

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
async def upload_resume(file: UploadFile = File(...)):
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

    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "text_length": len(extracted_text),
        "detected_skills": skills,
        "skills_count": len(skills),
        "ats_score": analysis["score"],
        "strengths": analysis["strengths"],
        "weaknesses": analysis["weaknesses"],
        "recommendations": analysis["recommendations"],
        "preview": extracted_text[:500],
        "message": "Resume analyzed successfully."
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

    matched_skills = sorted(set(resume_skills).intersection(set(job_skills)))
    missing_skills = sorted(set(job_skills).difference(set(resume_skills)))

    if len(job_skills) == 0:
        match_percentage = 0
    else:
        match_percentage = round((len(matched_skills) / len(job_skills)) * 100)

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