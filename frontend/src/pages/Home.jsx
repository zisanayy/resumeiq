import { useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import ScoreCircle from "../components/ScoreCircle";
import DownloadReport from "../components/DownloadReport";
import FileDropzone from "../components/FileDropzone";

function Home({ darkMode, toggleDarkMode }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getScoreColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError("Please select a resume first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      setError("");
      setAnalysis(null);

      const response = await api.post(
        "/resume/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAnalysis(response.data);
    } catch (error) {
      console.error(error);

      const message =
        error.response?.data?.detail ||
        "Something went wrong while analyzing the resume.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors">
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <main className="flex items-center justify-center p-6">
        <div className="w-full max-w-3xl rounded-2xl bg-white p-10 shadow-xl dark:bg-slate-900">
          <h1 className="text-center text-5xl font-bold text-blue-600">
            ResumeIQ
          </h1>

          <p className="mt-4 text-center text-gray-500 dark:text-slate-400">
            AI Powered Resume Analyzer
          </p>

          <div className="mt-10 rounded-xl bg-slate-50 p-8 text-center dark:bg-slate-800">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Upload your Resume
            </h2>

            <p className="mt-2 text-gray-500 dark:text-slate-400">
              Drag and drop a PDF or DOCX file.
            </p>

            <FileDropzone
              selectedFile={selectedFile}
              onFileSelect={(file) => {
                setSelectedFile(file);
                setError("");
                setAnalysis(null);
              }}
              inputId="resume-upload"
            />

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={loading}
              className="mt-6 rounded-xl bg-blue-600 px-8 py-3 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {loading ? "Analyzing..." : "Analyze Resume"}
            </button>
          </div>

          {analysis && (
            <div className="mt-8 grid gap-6">
              <div className="rounded-2xl bg-slate-900 p-8 text-center text-white shadow-lg">
                <p className="text-sm uppercase tracking-widest text-slate-300">
                  ATS Score
                </p>

                <div className="mt-5 flex justify-center">
                  <ScoreCircle score={analysis.ats_score} />
                </div>

                <p className="mt-3 font-medium text-green-300">
                  {analysis.ats_score >= 80
                    ? "Excellent Resume"
                    : analysis.ats_score >= 50
                    ? "Good Resume"
                    : "Needs Improvement"}
                </p>

                <div className="mt-6 h-4 w-full rounded-full bg-slate-700">
                  <div
                    className={`${getScoreColor(
                      analysis.ats_score
                    )} h-4 rounded-full transition-all duration-700`}
                    style={{
                      width: `${analysis.ats_score}%`,
                    }}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Detected Skills ({analysis.skills_count})
                </h3>

                <div className="mt-4 flex flex-wrap gap-2">
                  {analysis.detected_skills?.length > 0 ? (
                    analysis.detected_skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-slate-400">
                      No skills detected.
                    </p>
                  )}
                </div>
              </div>

              {analysis.suggested_skills?.length > 0 && (
                <div className="rounded-2xl border border-purple-200 bg-white p-6 dark:border-purple-800 dark:bg-slate-900">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    Suggested Skills
                  </h3>

                  <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
                    Skills that could strengthen your technical profile.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {analysis.suggested_skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-sm font-medium text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300"
                      >
                        ⭐ {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {analysis.overall_feedback && (
                <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    Overall Feedback
                  </h3>

                  <p className="mt-4 rounded-xl bg-slate-50 p-4 leading-relaxed text-gray-700 dark:bg-slate-800 dark:text-slate-300">
                    {analysis.overall_feedback}
                  </p>
                </div>
              )}

              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Recommendations
                </h3>

                {analysis.recommendations?.length > 0 ? (
                  <ul className="mt-4 space-y-3 text-gray-700 dark:text-slate-300">
                    {analysis.recommendations.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800"
                      >
                        <span className="text-blue-600">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4 text-gray-500 dark:text-slate-400">
                    No additional recommendations.
                  </p>
                )}
              </div>

              <div className="flex justify-center">
                <DownloadReport analysis={analysis} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;