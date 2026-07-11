import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function History({ darkMode, toggleDarkMode }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const [selectedAnalysis, setSelectedAnalysis] = useState(null);
  const [detailsLoadingId, setDetailsLoadingId] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/resume/history");
      setHistory(response.data.history || []);
    } catch (requestError) {
      console.error(requestError);
      setError("History could not be loaded.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (analysisId) => {
    if (selectedAnalysis?.id === analysisId) {
      setSelectedAnalysis(null);
      return;
    }

    try {
      setDetailsLoadingId(analysisId);
      setError("");

      const response = await api.get(
        `/resume/history/${analysisId}`
      );

      setSelectedAnalysis(response.data);
    } catch (requestError) {
      console.error(requestError);
      setError("Analysis details could not be loaded.");
    } finally {
      setDetailsLoadingId(null);
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

      if (selectedAnalysis?.id === analysisId) {
        setSelectedAnalysis(null);
      }
    } catch (requestError) {
      console.error(requestError);
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
    <div className="min-h-screen bg-slate-100 transition-colors dark:bg-slate-950">
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              Analysis History
            </h1>

            <p className="mt-2 text-gray-500 dark:text-slate-400">
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
              className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-slate-700 shadow dark:bg-slate-900 dark:text-slate-300">
            Loading history...
          </div>
        ) : history.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow dark:bg-slate-900">
            <div className="text-5xl">📭</div>

            <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
              No analyses yet
            </h2>

            <p className="mt-2 text-gray-500 dark:text-slate-400">
              Upload a resume first to see analysis history here.
            </p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow dark:bg-slate-900">
            <div className="text-5xl">🔎</div>

            <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
              No matching results
            </h2>

            <p className="mt-2 text-gray-500 dark:text-slate-400">
              Try a different filename.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {filteredHistory.map((item) => {
              const isOpen = selectedAnalysis?.id === item.id;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl dark:bg-blue-950">
                        📄
                      </div>

                      <div>
                        <h2 className="break-all text-xl font-bold text-slate-900 dark:text-white">
                          {item.filename}
                        </h2>

                        <p className="text-sm text-gray-500 dark:text-slate-400">
                          {new Date(item.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div
                        className={`rounded-xl px-4 py-2 font-semibold ${getScoreColor(
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
                        onClick={() => handleViewDetails(item.id)}
                        disabled={detailsLoadingId === item.id}
                        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-blue-300"
                      >
                        {detailsLoadingId === item.id
                          ? "Loading..."
                          : isOpen
                            ? "Hide Details"
                            : "View Details"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(item.id, item.filename)
                        }
                        disabled={deletingId === item.id}
                        className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:bg-red-300"
                      >
                        {deletingId === item.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <InfoBox
                      label="Text Length"
                      value={item.text_length}
                    />

                    <InfoBox
                      label="Analysis ID"
                      value={`#${item.id}`}
                    />

                    <InfoBox
                      label="Status"
                      value="Saved"
                      valueClassName="text-green-600 dark:text-green-300"
                    />
                  </div>

                  {isOpen && (
                    <div className="mt-6 border-t border-slate-200 pt-6 dark:border-slate-700">
                      <div className="grid gap-6 lg:grid-cols-2">
                        <DetailCard title="Detected Skills">
                          <div className="flex flex-wrap gap-2">
                            {selectedAnalysis.detected_skills?.length > 0 ? (
                              selectedAnalysis.detected_skills.map(
                                (skill) => (
                                  <span
                                    key={skill}
                                    className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300"
                                  >
                                    {skill}
                                  </span>
                                )
                              )
                            ) : (
                              <EmptyText text="No detected skills." />
                            )}
                          </div>
                        </DetailCard>

                        <DetailCard title="Strengths">
                          <DetailList
                            items={selectedAnalysis.strengths}
                            icon="✓"
                            iconClassName="text-green-600"
                          />
                        </DetailCard>

                        <DetailCard title="Weaknesses">
                          <DetailList
                            items={selectedAnalysis.weaknesses}
                            icon="!"
                            iconClassName="text-red-600"
                          />
                        </DetailCard>

                        <DetailCard title="Recommendations">
                          <DetailList
                            items={selectedAnalysis.recommendations}
                            icon="→"
                            iconClassName="text-blue-600"
                          />
                        </DetailCard>
                      </div>

                      <div className="mt-6 rounded-2xl bg-slate-900 p-6 text-center text-white">
                        <p className="text-sm uppercase tracking-widest text-slate-300">
                          Saved ATS Score
                        </p>

                        <p className="mt-2 text-5xl font-bold">
                          {selectedAnalysis.ats_score}%
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

function InfoBox({
  label,
  value,
  valueClassName = "text-slate-800 dark:text-white",
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
      <p className="text-sm text-gray-500 dark:text-slate-400">
        {label}
      </p>

      <p className={`text-xl font-bold ${valueClassName}`}>
        {value}
      </p>
    </div>
  );
}

function DetailCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
        {title}
      </h3>

      <div className="mt-4">{children}</div>
    </div>
  );
}

function DetailList({
  items,
  icon,
  iconClassName,
}) {
  if (!items?.length) {
    return <EmptyText text="No information available." />;
  }

  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li
          key={`${item}-${index}`}
          className="flex gap-3 rounded-xl bg-white p-3 text-slate-700 dark:bg-slate-900 dark:text-slate-300"
        >
          <span className={`font-bold ${iconClassName}`}>
            {icon}
          </span>

          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function EmptyText({ text }) {
  return (
    <p className="text-sm text-slate-500 dark:text-slate-400">
      {text}
    </p>
  );
}

export default History;