import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import FileDropzone from "../components/FileDropzone";
import LoadingOverlay from "../components/LoadingOverlay";
import ScoreCircle from "../components/ScoreCircle";

function JobMatcher({ darkMode, toggleDarkMode }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [matchResult, setMatchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resultsRef = useRef(null);

  useEffect(() => {
    if (!matchResult) {
      return;
    }

    const scrollTimer = window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 200);

    return () => window.clearTimeout(scrollTimer);
  }, [matchResult]);

  const getMatchLabel = (score) => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Strong Match";
    if (score >= 40) return "Moderate Match";
    return "Low Match";
  };

  const getMatchColor = (score) => {
    if (score >= 80) return "text-green-300";
    if (score >= 60) return "text-blue-300";
    if (score >= 40) return "text-yellow-300";
    return "text-red-300";
  };

  const getProgressColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleMatch = async () => {
    if (!selectedFile) {
      setError("Please select a resume first.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Please enter a job description.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("job_description", jobDescription);

    try {
      setLoading(true);
      setError("");
      setMatchResult(null);

      const response = await api.post("/resume/match-job", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMatchResult(response.data);
    } catch (requestError) {
      console.error(requestError);

      const message =
        requestError.response?.data?.detail ||
        "Something went wrong while matching the resume.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 transition-colors dark:bg-slate-950">
      {loading && (
        <LoadingOverlay message="Matching your resume with the job description..." />
      )}

      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl dark:border-slate-700 dark:bg-slate-900 sm:p-10">
          <div className="text-center">
            <div className="mx-auto inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              Resume-to-job comparison
            </div>

            <h1 className="mt-5 text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
              Job Matcher
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-slate-500 dark:text-slate-400">
              Upload your resume and paste a job description to see
              how well your profile matches the role.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-6 dark:bg-slate-800">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                1. Upload your resume
              </h2>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Drag and drop a PDF or DOCX file.
              </p>

              <FileDropzone
                selectedFile={selectedFile}
                onFileSelect={(file) => {
                  setSelectedFile(file);
                  setError("");
                  setMatchResult(null);
                }}
                inputId="job-resume-upload"
              />
            </div>

            <div className="rounded-2xl bg-slate-50 p-6 dark:bg-slate-800">
              <label
                htmlFor="job-description"
                className="text-xl font-bold text-slate-900 dark:text-white"
              >
                2. Paste the job description
              </label>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Add the responsibilities, requirements and technical skills.
              </p>

              <textarea
                id="job-description"
                value={jobDescription}
                onChange={(event) => {
                  setJobDescription(event.target.value);
                  setError("");
                  setMatchResult(null);
                }}
                placeholder="Example: We are looking for a Python developer with FastAPI, SQL, Docker and PostgreSQL experience..."
                className="mt-6 min-h-72 w-full resize-y rounded-xl border border-slate-300 bg-white p-4 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
              />

              <div className="mt-3 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Include the full job requirements.</span>
                <span>{jobDescription.length} characters</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleMatch}
            disabled={loading}
            className="mt-8 w-full rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {loading ? "Matching..." : "Match Resume with Job"}
          </button>
        </section>

        {matchResult && (
          <section
            ref={resultsRef}
            className="mt-10 grid scroll-mt-24 gap-6"
          >
            <div className="rounded-3xl bg-slate-900 p-8 text-center text-white shadow-xl dark:bg-black">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-300">
                Job Match Score
              </p>

              <div className="mt-6 flex justify-center">
                <ScoreCircle score={matchResult.match_percentage} />
              </div>

              <p
                className={`mt-4 text-xl font-semibold ${getMatchColor(
                  matchResult.match_percentage
                )}`}
              >
                {getMatchLabel(matchResult.match_percentage)}
              </p>

              <p className="mx-auto mt-3 max-w-2xl text-slate-300">
                Your resume matches{" "}
                <span className="font-semibold text-white">
                  {matchResult.matched_skills.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-white">
                  {matchResult.job_required_skills.length}
                </span>{" "}
                detected job skills.
              </p>

              <div className="mx-auto mt-7 h-4 w-full max-w-2xl rounded-full bg-slate-700">
                <div
                  className={`${getProgressColor(
                    matchResult.match_percentage
                  )} h-4 rounded-full transition-all duration-700`}
                  style={{
                    width: `${matchResult.match_percentage}%`,
                  }}
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <StatCard
                icon="🎯"
                label="Required Skills"
                value={matchResult.job_required_skills.length}
              />

              <StatCard
                icon="✅"
                label="Matched Skills"
                value={matchResult.matched_skills.length}
              />

              <StatCard
                icon="⚠️"
                label="Missing Skills"
                value={matchResult.missing_skills.length}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <SkillCard
                title="Matched Skills"
                description="Skills found in both your resume and the job description."
                skills={matchResult.matched_skills}
                emptyText="No matched skills found."
                badgeClassName="border-green-100 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
                cardClassName="border-green-200 dark:border-green-800"
                titleClassName="text-green-700 dark:text-green-300"
                icon="✓"
              />

              <SkillCard
                title="Missing Skills"
                description="Relevant job skills that were not detected in your resume."
                skills={matchResult.missing_skills}
                emptyText="No missing skills found. Great match!"
                badgeClassName="border-red-100 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
                cardClassName="border-red-200 dark:border-red-800"
                titleClassName="text-red-700 dark:text-red-300"
                icon="!"
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Recommendations
              </h3>

              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Improve these areas to strengthen your match with the role.
              </p>

              {matchResult.recommendations.length > 0 ? (
                <ul className="mt-5 grid gap-3 md:grid-cols-2">
                  {matchResult.recommendations.map((item, index) => (
                    <li
                      key={`${item}-${index}`}
                      className="flex gap-3 rounded-xl bg-slate-50 p-4 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      <span className="font-bold text-blue-600">→</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-5 rounded-xl bg-green-50 p-4 text-green-700 dark:bg-green-950 dark:text-green-300">
                  Your resume already covers all detected job skills.
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-950">
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-200">
                ResumeIQ Match Insight
              </h3>

              <p className="mt-3 leading-relaxed text-blue-800 dark:text-blue-300">
                {matchResult.match_percentage >= 80
                  ? "Your profile strongly aligns with this role. Focus on tailoring your achievements and measurable results to the job description."
                  : matchResult.match_percentage >= 60
                    ? "Your resume has a strong foundation for this role. Adding the missing skills and role-specific keywords could improve your chances."
                    : matchResult.match_percentage >= 40
                      ? "Your resume partially matches this role. Strengthen the missing technical areas and highlight more relevant projects."
                      : "This role currently has a low match with your resume. Consider building the missing skills or targeting roles closer to your current profile."}
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="text-3xl">{icon}</div>

      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
        {value}
      </p>
    </div>
  );
}

function SkillCard({
  title,
  description,
  skills,
  emptyText,
  badgeClassName,
  cardClassName,
  titleClassName,
  icon,
}) {
  return (
    <div
      className={`rounded-2xl border bg-white p-6 shadow-sm dark:bg-slate-900 ${cardClassName}`}
    >
      <h3 className={`text-xl font-bold ${titleClassName}`}>
        {title}
      </h3>

      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {skills.length > 0 ? (
          skills.map((skill) => (
            <span
              key={skill}
              className={`rounded-full border px-3 py-1 text-sm font-medium ${badgeClassName}`}
            >
              {icon} {skill}
            </span>
          ))
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {emptyText}
          </p>
        )}
      </div>
    </div>
  );
}

export default JobMatcher;