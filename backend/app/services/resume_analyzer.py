REQUIRED_CORE_SKILLS = ["python", "git", "github", "sql", "rest api"]

RECOMMENDED_BACKEND_SKILLS = ["fastapi", "sqlite", "docker", "testing", "postgresql"]

RECOMMENDED_AI_SKILLS = ["machine learning", "nlp", "pandas", "numpy", "scikit-learn"]


def calculate_resume_score(skills: list[str], text: str) -> dict:
    text_lower = text.lower()

    score = 0
    strengths = []
    weaknesses = []
    recommendations = []

    for skill in REQUIRED_CORE_SKILLS:
        if skill in skills:
            score += 8
            strengths.append(f"Includes core skill: {skill}")
        else:
            weaknesses.append(f"Missing core skill: {skill}")
            recommendations.append(f"Add or improve your experience with {skill}.")

    for skill in RECOMMENDED_BACKEND_SKILLS:
        if skill in skills:
            score += 5
            strengths.append(f"Includes backend skill: {skill}")
        else:
            recommendations.append(f"Consider adding {skill} to strengthen backend profile.")

    for skill in RECOMMENDED_AI_SKILLS:
        if skill in skills:
            score += 4
            strengths.append(f"Includes AI/data skill: {skill}")

    if "internship" in text_lower:
        score += 8
        strengths.append("Includes internship experience.")
    else:
        weaknesses.append("No internship experience detected.")

    if "project" in text_lower or "projects" in text_lower:
        score += 8
        strengths.append("Includes project experience.")
    else:
        weaknesses.append("No project experience detected.")

    if "github" in text_lower:
        score += 5
        strengths.append("Includes GitHub portfolio link.")
    else:
        weaknesses.append("No GitHub portfolio link detected.")
        recommendations.append("Add a GitHub portfolio link to your resume.")

    if len(text) > 1500:
        score += 5
        strengths.append("Resume has sufficient content length.")
    else:
        weaknesses.append("Resume may be too short.")
        recommendations.append("Add more details about projects, technologies and achievements.")

    return {
        "score": min(score, 100),
        "strengths": strengths,
        "weaknesses": weaknesses,
        "recommendations": recommendations[:8],
    }