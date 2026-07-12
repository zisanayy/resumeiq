import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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
      return "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-950";
    }

    if (score >= 50) {
      return "text-yellow-700 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-950";
    }

    return "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-950";
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-blue-50 transition-colors dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <main className="mx-auto max-w-6xl px-6 py-10">
        <section className="relative overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-7 py-10 text-white shadow-2xl sm:px-10">
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
                Saved resume analyses
              </div>

              <h1 className="mt-5 text-4xl font-bold sm:text-5xl">
                Analysis History
              </h1>

              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-blue-100">
                Review, search and manage your previous resume analyses.
              </p>
            </div>

            <div className="w-full rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-md md:w-80">
              <label
                htmlFor="history-search"
                className="text-sm font-medium text-blue-100"
              >
                Search by filename
              </label>

              <input
                id="history-search"
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search resumes..."
                className="mt-2 w-full rounded-xl border border-white/20 bg-white/90 px-4 py-3 text-slate-900 outline-none transition focus:ring-2 focus:ring-blue-300 dark:bg-slate-900 dark:text-white"
              />
            </div>
          </div>
        </section>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50/90 px-5 py-4 text-red-700 shadow-sm backdrop-blur dark:border-red-800 dark:bg-red-950/80 dark:text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="mt-8 rounded-3xl border border-white/70 bg-white/80 p-8 text-slate-700 shadow-xl backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
            Loading history...
          </div>
        ) : history.length === 0 ? (
          <EmptyState
            icon="📭"
            title="No analyses yet"
            text="Upload a resume first to see analysis history here."
          />
        ) : filteredHistory.length === 0 ? (
          <EmptyState
            icon="🔎"
            title="No matching results"
            text="Try a different filename."
          />
        ) : (
          <div className="mt-8 grid gap-6">
            {filteredHistory.map((item) => {
              const isOpen = selectedAnalysis?.id === item.id;

              return (
                <div
                  key={item.id}
                  className="group rounded-3xl border border-white/70 bg-white/85 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900/85"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 text-2xl shadow-sm transition-transform duration-300 group-hover:scale-110 dark:from-blue-950 dark:to-slate-900">
                        📄
                      </div>

                      <div>
                        <h2 className="break-all text-xl font-bold text-slate-900 dark:text-white">
                          {item.filename}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
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

                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          ATS Score
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleViewDetails(item.id)}
                        disabled={detailsLoadingId === item.id}
                        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-lg disabled:bg-blue-300"
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
                        className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-lg disabled:bg-red-300"
                      >
                        {deletingId === item.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <InfoBox
                      icon="📝"
                      label="Text Length"
                      value={item.text_length}
                    />

                    <InfoBox
                      icon="🔢"
                      label="Analysis ID"
                      value={`#${item.id}`}
                    />

                    <InfoBox
                      icon="✅"
                      label="Status"
                      value="Saved"
                      valueClassName="text-green-600 dark:text-green-300"
                    />
                  </div>

                  {isOpen && (
                    <div className="mt-7 border-t border-slate-200/80 pt-7 dark:border-slate-700">
                      <div className="grid gap-6 lg:grid-cols-2">
                        <DetailCard
                          icon="🎯"
                          title="Detected Skills"
                          accentClassName="from-blue-500 to-cyan-500"
                        >
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

                        <DetailCard
                          icon="💪"
                          title="Strengths"
                          accentClassName="from-green-500 to-emerald-500"
                        >
                          <DetailList
                            items={selectedAnalysis.strengths}
                            icon="✓"
                            iconClassName="text-green-600"
                          />
                        </DetailCard>

                        <DetailCard
                          icon="⚠️"
                          title="Weaknesses"
                          accentClassName="from-red-500 to-orange-500"
                        >
                          <DetailList
                            items={selectedAnalysis.weaknesses}
                            icon="!"
                            iconClassName="text-red-600"
                          />
                        </DetailCard>

                        <DetailCard
                          icon="💡"
                          title="Recommendations"
                          accentClassName="from-violet-500 to-purple-500"
                        >
                          <DetailList
                            items={selectedAnalysis.recommendations}
                            icon="→"
                            iconClassName="text-blue-600"
                          />
                        </DetailCard>
                      </div>

                      <div className="relative mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 p-7 text-center text-white shadow-xl">
                        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />

                        <p className="relative text-sm uppercase tracking-widest text-slate-300">
                          Saved ATS Score
                        </p>

                        <p className="relative mt-2 text-5xl font-bold">
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

      <Footer />
    </div>
  );
}

function EmptyState({ icon, title, text }) {
  return (
    <div className="mt-8 rounded-3xl border border-white/70 bg-white/85 p-12 text-center shadow-xl backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/85">
      <div className="text-5xl">{icon}</div>

      <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
        {title}
      </h2>

      <p className="mt-2 text-slate-500 dark:text-slate-400">
        {text}
      </p>
    </div>
  );
}

function InfoBox({
  icon,
  label,
  value,
  valueClassName = "text-slate-800 dark:text-white",
}) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white to-slate-50 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
      <div className="text-2xl">{icon}</div>

      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p className={`mt-1 text-xl font-bold ${valueClassName}`}>
        {value}
      </p>
    </div>
  );
}

function DetailCard({
  icon,
  title,
  accentClassName,
  children,
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
      <div
        className={`absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r ${accentClassName}`}
      />

      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
      </div>

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
          className="flex gap-3 rounded-xl border border-slate-200/70 bg-white/80 p-3 text-slate-700 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300"
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