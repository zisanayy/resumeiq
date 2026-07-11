import { useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import FileDropzone from "../components/FileDropzone";

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
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <main className="flex items-center justify-center p-6">
        <div className="w-full max-w-4xl rounded-2xl bg-white p-10 shadow-xl dark:bg-slate-900">
          <h1 className="text-center text-4xl font-bold text-blue-600">
            Job Matcher
          </h1>

          <p className="mt-4 text-center text-gray-500 dark:text-slate-400">
            Match your resume with a job description.
          </p>

          <div className="mt-10 grid gap-6">
            <div className="rounded-xl bg-slate-50 p-8 text-center dark:bg-slate-800">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Upload your Resume
              </h2>

              <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
                Drag and drop your file or click to browse.
              </p>

              <FileDropzone
                selectedFile={selectedFile}
                onFileSelect={setSelectedFile}
                inputId="job-resume-upload"
              />
            </div>

            <div>
              <label
                htmlFor="job-description"
                className="font-semibold text-gray-700 dark:text-slate-200"
              >
                Job Description
              </label>

              <textarea
                id="job-description"
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                placeholder="Paste the job description here..."
                className="mt-3 min-h-40 w-full rounded-xl border border-slate-300 bg-white p-4 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <button
              type="button"
              onClick={handleMatch}
              disabled={loading}
              className="rounded-xl bg-blue-600 px-8 py-3 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {loading ? "Matching..." : "Match Resume"}
            </button>
          </div>

          {matchResult && (
            <div className="mt-8 grid gap-6">
              <div className="rounded-2xl bg-slate-900 p-8 text-center text-white shadow-lg dark:bg-black">
                <p className="text-sm uppercase tracking-widest text-slate-300">
                  Job Match Score
                </p>

                <h2 className="mt-3 text-6xl font-bold">
                  {matchResult.match_percentage}%
                </h2>

                <p className="mt-3 font-medium text-green-300">
                  Resume matches this job description.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-green-200 bg-white p-6 dark:border-green-800 dark:bg-slate-900">
                  <h3 className="text-xl font-bold text-green-700 dark:text-green-300">
                    Matched Skills
                  </h3>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {matchResult.matched_skills.length > 0 ? (
                      matchResult.matched_skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-green-100 bg-green-50 px-3 py-1 text-sm font-medium text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-slate-400">
                        No matched skills found.
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-red-200 bg-white p-6 dark:border-red-800 dark:bg-slate-900">
                  <h3 className="text-xl font-bold text-red-700 dark:text-red-300">
                    Missing Skills
                  </h3>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {matchResult.missing_skills.length > 0 ? (
                      matchResult.missing_skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-red-100 bg-red-50 px-3 py-1 text-sm font-medium text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-slate-400">
                        No missing skills found.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Recommendations
                </h3>

                {matchResult.recommendations.length > 0 ? (
                  <ul className="mt-4 space-y-3 text-gray-700 dark:text-slate-300">
                    {matchResult.recommendations.map((item) => (
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
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default JobMatcher;