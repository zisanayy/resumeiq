import { useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Home({ darkMode, toggleDarkMode }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const getScoreColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      alert("Please select a resume first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);

      const response = await api.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setAnalysis(response.data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while analyzing the resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <main className="flex items-center justify-center p-6">
        <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-10 w-full max-w-3xl">
          <h1 className="text-5xl font-bold text-center text-blue-600">
            ResumeIQ
          </h1>

          <p className="text-center text-gray-500 dark:text-slate-400 mt-4">
            AI Powered Resume Analyzer
          </p>

          <div className="mt-10 rounded-xl p-8 text-center bg-slate-50 dark:bg-slate-800">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Upload your Resume
            </h2>

            <p className="text-gray-500 dark:text-slate-400 mt-2">
              PDF or DOCX supported
            </p>

            <label
              htmlFor="resume-upload"
              className="mt-6 flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-xl p-10 hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-300"
            >
              <div className="text-6xl">📄</div>

              <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-slate-200">
                Click to upload your resume
              </p>

              <p className="text-gray-500 dark:text-slate-400 text-sm">
                PDF or DOCX
              </p>

              {selectedFile && (
                <div className="mt-5 px-4 py-2 rounded-lg bg-green-100 text-green-700 font-medium">
                  ✅ {selectedFile.name}
                </div>
              )}
            </label>

            <input
              id="resume-upload"
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-8 py-3 rounded-xl"
            >
              {loading ? "Analyzing..." : "Analyze Resume"}
            </button>
          </div>

          {analysis && (
            <div className="mt-8 grid gap-6">
              <div className="bg-slate-900 text-white rounded-2xl p-8 text-center shadow-lg">
                <p className="text-sm uppercase tracking-widest text-slate-300">
                  ATS Score
                </p>

                <h2 className="text-6xl font-bold mt-3">
                  {analysis.ats_score}%
                </h2>

                <p className="mt-3 text-green-300 font-medium">
                  {analysis.ats_score >= 80
                    ? "Excellent Resume"
                    : analysis.ats_score >= 50
                    ? "Good Resume"
                    : "Needs Improvement"}
                </p>

                <div className="mt-6 w-full bg-slate-700 rounded-full h-4">
                  <div
                    className={`${getScoreColor(
                      analysis.ats_score
                    )} h-4 rounded-full transition-all duration-700`}
                    style={{ width: `${analysis.ats_score}%` }}
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Detected Skills ({analysis.skills_count})
                </h3>

                <div className="mt-4 flex flex-wrap gap-2">
                  {analysis.detected_skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Recommendations
                </h3>

                <ul className="mt-4 space-y-3 text-gray-700 dark:text-slate-300">
                  {analysis.recommendations.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl p-3"
                    >
                      <span className="text-blue-600">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;