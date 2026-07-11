import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function History({ darkMode, toggleDarkMode }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/resume/history");
      setHistory(response.data.history || []);
    } catch (error) {
      console.error(error);
      setError("History could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (analysisId, filename) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${filename}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(analysisId);
      setError("");

      await api.delete(`/resume/history/${analysisId}`);

      setHistory((currentHistory) =>
        currentHistory.filter((item) => item.id !== analysisId)
      );
    } catch (error) {
      console.error(error);
      setError("The analysis could not be deleted.");
    } finally {
      setDeletingId(null);
    }
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent";
    if (score >= 50) return "Good";
    return "Needs Work";
  };

  const getScoreColor = (score) => {
    if (score >= 80) {
      return "text-green-600 bg-green-50 dark:text-green-300 dark:bg-green-950";
    }

    if (score >= 50) {
      return "text-yellow-600 bg-yellow-50 dark:text-yellow-300 dark:bg-yellow-950";
    }

    return "text-red-600 bg-red-50 dark:text-red-300 dark:bg-red-950";
  };

  const filteredHistory = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return history;
    }

    return history.filter((item) =>
      item.filename.toLowerCase().includes(normalizedSearch)
    );
  }, [history, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              Analysis History
            </h1>

            <p className="text-gray-500 dark:text-slate-400 mt-2">
              Review, search and manage your previous resume analyses.
            </p>
          </div>

          <div className="w-full md:w-80">
            <label
              htmlFor="history-search"
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Search by filename
            </label>

            <input
              id="history-search"
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search resumes..."
              className="mt-2 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 px-4 py-3 text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow text-slate-700 dark:text-slate-300">
            Loading history...
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 shadow text-center">
            <div className="text-5xl">📭</div>

            <h2 className="text-2xl font-bold mt-4 text-slate-900 dark:text-white">
              No analyses yet
            </h2>

            <p className="text-gray-500 dark:text-slate-400 mt-2">
              Upload a resume first to see analysis history here.
            </p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 shadow text-center">
            <div className="text-5xl">🔎</div>

            <h2 className="text-2xl font-bold mt-4 text-slate-900 dark:text-white">
              No matching results
            </h2>

            <p className="text-gray-500 dark:text-slate-400 mt-2">
              Try a different filename.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-2xl">
                      📄
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white break-all">
                        {item.filename}
                      </h2>

                      <p className="text-sm text-gray-500 dark:text-slate-400">
                        {new Date(item.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div
                      className={`px-4 py-2 rounded-xl font-semibold ${getScoreColor(
                        item.ats_score
                      )}`}
                    >
                      {getScoreLabel(item.ats_score)}
                    </div>

                    <div className="text-right">
                      <p className="text-3xl font-bold text-blue-600">
                        {item.ats_score}%
                      </p>

                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        ATS Score
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.filename)}
                      disabled={deletingId === item.id}
                      className="rounded-xl bg-red-600 hover:bg-red-700 disabled:bg-red-300 px-4 py-2 text-sm font-semibold text-white transition"
                    >
                      {deletingId === item.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Text Length
                    </p>

                    <p className="text-xl font-bold text-slate-800 dark:text-white">
                      {item.text_length}
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Analysis ID
                    </p>

                    <p className="text-xl font-bold text-slate-800 dark:text-white">
                      #{item.id}
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                    <p className="text-sm text-gray-500 dark:text-slate-400">
                      Status
                    </p>

                    <p className="text-xl font-bold text-green-600 dark:text-green-300">
                      Saved
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default History;