import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScoreCircle from "../components/ScoreCircle";
import DownloadReport from "../components/DownloadReport";
import FileDropzone from "../components/FileDropzone";
import LoadingOverlay from "../components/LoadingOverlay";
import heroImage from "../assets/hero-office.png";

function Home({ darkMode, toggleDarkMode }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resultsRef = useRef(null);

  useEffect(() => {
    if (!analysis) {
      return;
    }

    const scrollTimer = window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 200);

    return () => window.clearTimeout(scrollTimer);
  }, [analysis]);

  const getScoreColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const scrollToUpload = () => {
    document
      .getElementById("upload-section")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
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

      const response = await api.post("/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setAnalysis(response.data);
    } catch (requestError) {
      console.error(requestError);

      const message =
        requestError.response?.data?.detail ||
        "Something went wrong while analyzing the resume.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-blue-50 transition-colors dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      {loading && (
        <LoadingOverlay message="Analyzing your resume..." />
      )}

      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <section
        className="relative min-h-[580px] bg-cover bg-center"
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/65 to-slate-950/80" />

        <div className="relative z-10 mx-auto flex min-h-[580px] max-w-6xl flex-col items-center justify-center px-6 py-20 text-center text-white">
          <div className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm shadow-lg backdrop-blur-md">
            AI-powered career technology
          </div>

          <h1 className="mt-6 text-5xl font-bold tracking-tight drop-shadow-lg sm:text-6xl lg:text-7xl">
            Resume<span className="text-blue-400">IQ</span>
          </h1>

          <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">
            AI Powered{" "}
            <span className="text-blue-400">
              Resume Analyzer
            </span>
          </h2>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-200">
            Analyze your resume in seconds, improve your ATS
            score and receive actionable recommendations for
            your career.
          </p>

          <div className="mt-9 grid gap-4 sm:grid-cols-3">
            <FeatureBadge
              icon="📊"
              title="AI Analysis"
              subtitle="Smart scoring"
            />

            <FeatureBadge
              icon="🎯"
              title="ATS Scoring"
              subtitle="Industry focused"
            />

            <FeatureBadge
              icon="⚡"
              title="Suggestions"
              subtitle="Actionable feedback"
            />
          </div>

          <button
            type="button"
            onClick={scrollToUpload}
            className="mt-10 rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-blue-950/30 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-2xl"
          >
            Analyze Your Resume →
          </button>
        </div>
      </section>

      <main
        id="upload-section"
        className="relative z-20 mx-auto -mt-16 max-w-6xl scroll-mt-24 px-6 pb-16"
      >
        <section className="rounded-3xl border border-white/70 bg-white/85 p-7 shadow-2xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/85 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div className="rounded-2xl bg-gradient-to-br from-blue-50/70 to-white p-2 dark:from-slate-800 dark:to-slate-900">
              <FileDropzone
                selectedFile={selectedFile}
                onFileSelect={(file) => {
                  setSelectedFile(file);
                  setError("");
                  setAnalysis(null);
                }}
                inputId="resume-upload"
              />
            </div>

            <div className="flex flex-col justify-center rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-6 shadow-md dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-2xl dark:bg-blue-950">
                🚀
              </div>

              <h2 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">
                Ready to analyze your resume?
              </h2>

              <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
                Upload your CV to receive instant insights
                about your skills, strengths and improvement
                areas.
              </p>

              <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300">
                🔒 Your document is processed securely.
              </div>

              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={loading}
                className="mt-6 rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {loading ? "Analyzing..." : "Analyze Resume"}
              </button>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-200/80 pt-9 dark:border-slate-700">
            <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-white">
              Why ResumeIQ?
            </h2>

            <p className="mx-auto mt-2 max-w-2xl text-center text-slate-500 dark:text-slate-400">
              Everything you need to evaluate and strengthen your resume.
            </p>

            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <InfoCard
                icon="🧠"
                title="AI Analysis"
                text="Analyze resume content, skills and experience."
                accent="blue"
              />

              <InfoCard
                icon="🛡️"
                title="ATS Score"
                text="Receive a score based on technical keywords."
                accent="green"
              />

              <InfoCard
                icon="💡"
                title="Recommendations"
                text="Discover useful skills and practical improvements."
                accent="purple"
              />

              <InfoCard
                icon="📈"
                title="Detailed Insights"
                text="Track scores and progress from your dashboard."
                accent="orange"
              />
            </div>
          </div>
        </section>

        {analysis && (
          <section
            ref={resultsRef}
            className="mt-10 grid scroll-mt-24 gap-6"
          >
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 p-8 text-center text-white shadow-2xl">
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

              <p className="relative text-sm uppercase tracking-[0.25em] text-slate-300">
                ATS Score
              </p>

              <div className="relative mt-5 flex justify-center">
                <ScoreCircle score={analysis.ats_score} />
              </div>

              <p className="relative mt-4 text-lg font-semibold text-green-300">
                {analysis.ats_score >= 80
                  ? "Excellent Resume"
                  : analysis.ats_score >= 50
                    ? "Good Resume"
                    : "Needs Improvement"}
              </p>

              <div className="relative mx-auto mt-7 h-4 w-full max-w-2xl rounded-full bg-slate-700">
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

            <div className="grid gap-6 lg:grid-cols-2">
              <ResultCard
                icon="🎯"
                title={`Detected Skills (${analysis.skills_count})`}
                accent="blue"
              >
                <div className="flex flex-wrap gap-2">
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
                    <p className="text-slate-500 dark:text-slate-400">
                      No skills detected.
                    </p>
                  )}
                </div>
              </ResultCard>

              <ResultCard
                icon="⭐"
                title="Suggested Skills"
                accent="purple"
              >
                <div className="flex flex-wrap gap-2">
                  {analysis.suggested_skills?.length > 0 ? (
                    analysis.suggested_skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-sm font-medium text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-slate-500 dark:text-slate-400">
                      Your profile already contains the suggested skills.
                    </p>
                  )}
                </div>
              </ResultCard>
            </div>

            {analysis.overall_feedback && (
              <ResultCard
                icon="🧠"
                title="Overall Feedback"
                accent="green"
              >
                <p className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 leading-relaxed text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {analysis.overall_feedback}
                </p>
              </ResultCard>
            )}

            <ResultCard
              icon="💡"
              title="Recommendations"
              accent="orange"
            >
              {analysis.recommendations?.length > 0 ? (
                <ul className="space-y-3">
                  {analysis.recommendations.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 rounded-xl border border-slate-200/70 bg-slate-50/80 p-4 text-slate-700 transition hover:border-blue-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      <span className="font-bold text-blue-600">
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 dark:text-slate-400">
                  No additional recommendations.
                </p>
              )}
            </ResultCard>

            <div className="flex justify-center">
              <DownloadReport analysis={analysis} />
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

function FeatureBadge({ icon, title, subtitle }) {
  return (
    <div className="group flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-5 py-4 text-left shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/15">
      <div className="text-2xl transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>

      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-slate-300">{subtitle}</p>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, text, accent }) {
  const accentClasses = {
    blue: "from-blue-500 to-cyan-500",
    green: "from-emerald-500 to-teal-500",
    purple: "from-violet-500 to-purple-500",
    orange: "from-amber-400 to-orange-500",
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white to-slate-50 p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:from-slate-900 dark:to-slate-800">
      <div
        className={`absolute left-0 top-0 h-1 w-full bg-gradient-to-r ${accentClasses[accent]}`}
      />

      <div className="text-3xl transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>

      <h3 className="mt-4 font-bold text-slate-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        {text}
      </p>
    </div>
  );
}

function ResultCard({ icon, title, accent, children }) {
  const accentClasses = {
    blue: "from-blue-500 to-cyan-500",
    green: "from-emerald-500 to-teal-500",
    purple: "from-violet-500 to-purple-500",
    orange: "from-amber-400 to-orange-500",
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/70 bg-white/85 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900/85">
      <div
        className={`absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r ${accentClasses[accent]}`}
      />

      <div className="flex items-center gap-3">
        <div className="text-2xl">{icon}</div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
      </div>

      <div className="mt-4">{children}</div>
    </div>
  );
}

export default Home;