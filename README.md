# 🚀 ResumeIQ

![ResumeIQ Banner](images/hero-office.png)

![Python](https://img.shields.io/badge/Python-3.13-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi)
![React](https://img.shields.io/badge/React-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38BDF8?logo=tailwindcss)
![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)
![Render](https://img.shields.io/badge/Backend-Render-46E3B7)

> AI-powered resume analysis and job-matching platform built with FastAPI and React.

ResumeIQ analyzes PDF and DOCX resumes, calculates ATS scores, detects technical skills, compares resumes with job descriptions, and provides actionable recommendations.

---

## 🌐 Live Demo

- **Frontend:** https://resumeiq-mu.vercel.app
- **Backend API:** https://resumeiq-5e2z.onrender.com
- **API Documentation:** https://resumeiq-5e2z.onrender.com/docs

> The backend uses Render’s free plan, so the first request may take 30–60 seconds while the service wakes up.

---

## 📸 Screenshots

### Home

![Home](images/hero.png)

### Dashboard

![Dashboard](images/dashboard.png)

### Resume Analyzer

![Resume Analyzer](images/resume-analyzer.png)

### Job Matcher

![Job Matcher](images/job-matcher.png)

### Analysis History

![History](images/history.png)

---

## ✨ Features

- PDF and DOCX resume upload
- Drag-and-drop file selection
- ATS score calculation
- Technical skill detection
- Suggested skill recommendations
- Strengths and weaknesses analysis
- Overall resume feedback
- Resume-to-job matching
- Matched and missing skill comparison
- Job match percentage
- Dashboard statistics and ATS progress chart
- Searchable analysis history
- Detailed history view
- Delete saved analyses
- Downloadable PDF reports
- Dark and light themes
- Responsive interface
- Loading animations and automatic result scrolling

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Recharts
- jsPDF
- html2canvas

### Backend

- Python
- FastAPI
- SQLAlchemy
- SQLite
- spaCy
- PyPDF
- python-docx
- Uvicorn

### Deployment

- Vercel
- Render
- GitHub

---

## 📄 Application Pages

### Resume Analyzer

Upload a PDF or DOCX resume to receive:

- ATS score
- Detected skills
- Suggested skills
- Overall feedback
- Improvement recommendations
- Downloadable PDF report

### Job Matcher

Upload a resume and paste a job description to receive:

- Match percentage
- Required skills
- Matched skills
- Missing skills
- Role-specific recommendations

### Dashboard

View:

- Total analyses
- Average ATS score
- Best ATS score
- Latest analysis
- ATS progress chart
- Recent analyses

### Analysis History

Users can:

- Search analyses by filename
- View detailed analysis results
- Review strengths and weaknesses
- Review detected skills
- Delete saved analyses

---

## ⚙️ Run Locally

### Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 📂 Project Structure

```text
ResumeIQ
├── backend
│   ├── app
│   │   ├── api
│   │   ├── core
│   │   ├── models
│   │   ├── services
│   │   └── main.py
│   └── requirements.txt
├── frontend
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── pages
│   │   └── services
│   └── package.json
├── images
│   ├── hero-office.png
│   ├── hero.png
│   ├── dashboard.png
│   ├── resume-analyzer.png
│   ├── job-matcher.png
│   └── history.png
└── README.md
```

---

## 📌 Current Limitations

- Skill extraction is based on a predefined technical skill list.
- ATS scoring is rule-based rather than powered by a large language model.
- SQLite data may be reset on a free Render deployment.
- User authentication is not included yet.

---

## 🔮 Future Improvements

- PostgreSQL integration
- User authentication
- Individual user histories
- AI-powered resume rewriting
- Cover letter generation
- Multilingual resume analysis
- Cloud file storage
- Recruiter dashboard

---

## 👩‍💻 Author

**Zeynep Zişan Ay**

- GitHub: https://github.com/zisanayy
- LinkedIn: https://www.linkedin.com/in/zeynep-zi%C5%9Fan-ay-5b8918313/

---

⭐ If you found this project useful, consider giving it a star.

Built with React, FastAPI and Python.