from fastapi import UploadFile
from pypdf import PdfReader
from docx import Document
import io


async def extract_text_from_file(file: UploadFile) -> str:
    content = await file.read()

    if file.content_type == "application/pdf":
        return extract_text_from_pdf(content)

    if file.content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        return extract_text_from_docx(content)

    return ""


def extract_text_from_pdf(content: bytes) -> str:
    pdf_file = io.BytesIO(content)
    reader = PdfReader(pdf_file)

    text = ""

    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"

    return text.strip()


def extract_text_from_docx(content: bytes) -> str:
    docx_file = io.BytesIO(content)
    document = Document(docx_file)

    text = ""

    for paragraph in document.paragraphs:
        text += paragraph.text + "\n"

    return text.strip()