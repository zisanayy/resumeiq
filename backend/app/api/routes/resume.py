from fastapi import APIRouter, UploadFile, File, HTTPException

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

    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "message": "Resume uploaded successfully."
    }