import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import api from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Dashboard({ darkMode, toggleDarkMode }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setError("");

        const response = await api.get("/resume/history");
        setHistory(response.data.history || []);
      } catch (requestError) {
        console.error(requestError);
        setError("Dashboard data could not be loaded.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const statistics = useMemo(() => {
    if (history.length === 0) {
      return {
        total: 0,
        average: 0,
        best: 0,
        lastAnalysis: "No analyses yet",
      };
    }

    const scores = history.map((item) => item.ats_score);
    const totalScore = scores.reduce((sum, score) => sum + score, 0);

    return {
      total: history.length,
      average: Math.round(totalScore / history.length),
      best: Math.max(...scores),
      lastAnalysis: new Date(history[0].created_at).toLocaleString(),
    };
  }, [history]);

  const recentAnalyses = history.slice(0, 5);

  const chartData = useMemo(() => {
    return [...history]
      .reverse()
      .slice(-10)
      .map((item, index) => ({
        name: `#${index + 1}`,
        score: item.ats_score,
        filename: item.filename,
        date: new Date(item.created_at).toLocaleDateString(),
      }));
  }, [history]);

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

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
            <div>
              <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
                Resume analytics overview
              </div>

              <h1 className="mt-5 text-4xl font-bold sm:text-5xl">
                Welcome to your Dashboard
              </h1>

              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-blue-100">
                Track your ATS performance, review recent analyses
                and measure how your resume improves over time.
              </p>
            </div>

            <div className="rounded-3xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur-md">
              <p className="text-sm uppercase tracking-[0.2em] text-blue-100">
                Average ATS
              </p>

              <p className="mt-3 text-6xl font-bold">
                {statistics.average}%
              </p>

              <p className="mt-3 text-sm text-blue-100">
                Based on {statistics.total} saved analyses
              </p>
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
            Loading dashboard...
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon="📄"
                title="Total Analyses"
                value={statistics.total}
                accentClassName="from-blue-500 to-cyan-500"
              />

              <StatCard
                icon="⭐"
                title="Average ATS"
                value={`${statistics.average}%`}
                accentClassName="from-violet-500 to-purple-500"
              />

              <StatCard
                icon="🏆"
                title="Best ATS"
                value={`${statistics.best}%`}
                accentClassName="from-amber-400 to-orange-500"
              />

              <StatCard
                icon="🕒"
                title="Last Analysis"
                value={statistics.lastAnalysis}
                small
                accentClassName="from-emerald-500 to-teal-500"
              />
            </div>

            <section className="mt-8 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900/80">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-2xl dark:bg-blue-950">
                    📈
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      ATS Progress
                    </h2>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Scores from your latest resume analyses.
                    </p>
                  </div>
                </div>

                <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  Last {chartData.length} analyses
                </div>
              </div>

              {chartData.length === 0 ? (
                <div className="py-14 text-center text-slate-500 dark:text-slate-400">
                  Analyze a resume to see your progress chart.
                </div>
              ) : (
                <div className="mt-7 h-80 w-full rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 p-4 dark:from-slate-800 dark:to-slate-900">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{
                        top: 10,
                        right: 20,
                        left: 0,
                        bottom: 10,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="4 4"
                        stroke={darkMode ? "#334155" : "#dbeafe"}
                      />

                      <XAxis
                        dataKey="name"
                        stroke={darkMode ? "#94a3b8" : "#64748b"}
                      />

                      <YAxis
                        domain={[0, 100]}
                        stroke={darkMode ? "#94a3b8" : "#64748b"}
                      />

                      <Tooltip
                        contentStyle={{
                          backgroundColor: darkMode
                            ? "#0f172a"
                            : "rgba(255,255,255,0.96)",
                          borderColor: darkMode
                            ? "#334155"
                            : "#bfdbfe",
                          borderRadius: "16px",
                          boxShadow:
                            "0 12px 30px rgba(15,23,42,0.12)",
                          color: darkMode
                            ? "#ffffff"
                            : "#0f172a",
                        }}
                        formatter={(value) => [
                          `${value}%`,
                          "ATS Score",
                        ]}
                        labelFormatter={(label, payload) => {
                          const item = payload?.[0]?.payload;

                          if (!item) {
                            return label;
                          }

                          return `${item.filename} — ${item.date}`;
                        }}
                      />

                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#2563eb"
                        strokeWidth={4}
                        dot={{
                          r: 5,
                          fill: "#2563eb",
                          strokeWidth: 3,
                          stroke: "#dbeafe",
                        }}
                        activeDot={{
                          r: 8,
                          fill: "#2563eb",
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </section>

            <section className="mt-8 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-slate-700 dark:bg-slate-900/80">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-100 text-2xl dark:bg-purple-950">
                  🗂️
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Recent Analyses
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Your five most recent resume analyses.
                  </p>
                </div>
              </div>

              {recentAnalyses.length === 0 ? (
                <div className="py-14 text-center">
                  <div className="text-5xl">📭</div>

                  <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                    No analyses yet
                  </h3>

                  <p className="mt-2 text-slate-500 dark:text-slate-400">
                    Analyze a resume to populate your dashboard.
                  </p>
                </div>
              ) : (
                <div className="mt-7 space-y-4">
                  {recentAnalyses.map((item) => (
                    <div
                      key={item.id}
                      className="group flex flex-col gap-4 rounded-2xl border border-slate-200/70 bg-gradient-to-r from-white to-slate-50 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg sm:flex-row sm:items-center sm:justify-between dark:border-slate-700 dark:from-slate-800 dark:to-slate-900 dark:hover:border-blue-700"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-xl transition-transform duration-300 group-hover:scale-110 dark:bg-blue-950">
                          📄
                        </div>

                        <div>
                          <p className="break-all font-semibold text-slate-900 dark:text-white">
                            {item.filename}
                          </p>

                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {new Date(
                              item.created_at
                            ).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-semibold ${
                            item.ats_score >= 80
                              ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                              : item.ats_score >= 50
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300"
                                : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                          }`}
                        >
                          {item.ats_score >= 80
                            ? "Excellent"
                            : item.ats_score >= 50
                              ? "Good"
                              : "Needs Work"}
                        </span>

                        <span className="text-2xl font-bold text-blue-600">
                          {item.ats_score}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  small = false,
  accentClassName,
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-white to-slate-50 p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-slate-700 dark:from-slate-900 dark:to-slate-800">
      <div
        className={`absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r ${accentClassName}`}
      />

      <div className="flex items-start justify-between">
        <div className="text-5xl transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>

        <div
          className={`h-10 w-10 rounded-full bg-gradient-to-br opacity-20 blur-sm ${accentClassName}`}
        />
      </div>

      <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {title}
      </p>

      <p
        className={`mt-2 font-bold text-slate-900 dark:text-white ${
          small
            ? "break-words text-base leading-relaxed"
            : "text-4xl"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default Dashboard;