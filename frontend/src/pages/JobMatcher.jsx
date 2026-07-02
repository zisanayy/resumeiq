import { useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function JobMatcher({ darkMode, toggleDarkMode }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [matchResult, setMatchResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMatch = async () => {
    if (!selectedFile) {
      alert("Please select a resume first.");
      return;
    }

    if (!jobDescription.trim()) {
      alert("Please enter a job description.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("job_description", jobDescription);

    try {
      setLoading(true);

      const response = await api.post("/resume/match-job", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMatchResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while matching the resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <main className="flex items-center justify-center p-6">
        <div className="bg-white dark:bg-slate-900 shadow-xl rounded-2xl p-10 w-full max-w-4xl">
          <h1 className="text-4xl font-bold text-center text-blue-600">
            Job Matcher
          </h1>

          <p className="text-center text-gray-500 dark:text-slate-400 mt-4">
            Match your resume with a job description.
          </p>

          <div className="mt-10 grid gap-6">
            <div className="rounded-xl p-8 text-center bg-slate-50 dark:bg-slate-800">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Upload your Resume
              </h2>

              <label
                htmlFor="job-resume-upload"
                className="mt-6 flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-xl p-8 hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-300"
              >
                <div className="text-5xl">📄</div>

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
                id="job-resume-upload"
                type="file"
                accept=".pdf,.docx"
                onChange={(event) => setSelectedFile(event.target.files[0])}
                className="hidden"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 dark:text-slate-200">
                Job Description
              </label>

              <textarea
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                placeholder="Paste the job description here..."
                className="mt-3 w-full min-h-40 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleMatch}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-8 py-3 rounded-xl"
            >
              {loading ? "Matching..." : "Match Resume"}
            </button>
          </div>

          {matchResult && (
            <div className="mt-8 grid gap-6">
              <div className="bg-slate-900 dark:bg-black text-white rounded-2xl p-8 text-center shadow-lg">
                <p className="text-sm uppercase tracking-widest text-slate-300">
                  Job Match Score
                </p>

                <h2 className="text-6xl font-bold mt-3">
                  {matchResult.match_percentage}%
                </h2>

                <p className="mt-3 text-green-300 font-medium">
                  Resume matches this job description.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 border border-green-200 dark:border-green-800 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-green-700 dark:text-green-300">
                    Matched Skills
                  </h3>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {matchResult.matched_skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border border-green-100 dark:border-green-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-800 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-red-700 dark:text-red-300">
                    Missing Skills
                  </h3>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {matchResult.missing_skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-100 dark:border-red-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Recommendations
                </h3>

                <ul className="mt-4 space-y-3 text-gray-700 dark:text-slate-300">
                  {matchResult.recommendations.map((item) => (
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

export default JobMatcher;