TECHNICAL_SKILLS = [
    "python",
    "fastapi",
    "django",
    "flask",
    "java",
    "c#",
    "javascript",
    "typescript",
    "html",
    "css",
    "sql",
    "sqlite",
    "postgresql",
    "mysql",
    "mongodb",
    "git",
    "github",
    "docker",
    "rest api",
    "machine learning",
    "artificial intelligence",
    "nlp",
    "natural language processing",
    "pandas",
    "numpy",
    "scikit-learn",
    "tensorflow",
    "pytorch",
    "excel",
    "power bi",
]


def extract_skills(text: str) -> list[str]:
    text_lower = text.lower()
    found_skills = []

    for skill in TECHNICAL_SKILLS:
        if skill in text_lower:
            found_skills.append(skill)

    return sorted(set(found_skills))