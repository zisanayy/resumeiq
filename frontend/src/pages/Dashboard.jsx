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
      } catch (error) {
        console.error(error);
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
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            Dashboard
          </h1>

          <p className="mt-2 text-gray-500 dark:text-slate-400">
            Track your resume analysis performance and recent activity.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950 px-4 py-3 text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl bg-white dark:bg-slate-900 p-8 shadow text-slate-700 dark:text-slate-300">
            Loading dashboard...
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon="📄"
                title="Total Analyses"
                value={statistics.total}
              />

              <StatCard
                icon="⭐"
                title="Average ATS"
                value={`${statistics.average}%`}
              />

              <StatCard
                icon="🏆"
                title="Best ATS"
                value={`${statistics.best}%`}
              />

              <StatCard
                icon="🕒"
                title="Last Analysis"
                value={statistics.lastAnalysis}
                small
              />
            </div>

            <section className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  ATS Progress
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                  Scores from your latest resume analyses.
                </p>
              </div>

              {chartData.length === 0 ? (
                <div className="py-12 text-center text-gray-500 dark:text-slate-400">
                  Analyze a resume to see your progress chart.
                </div>
              ) : (
                <div className="mt-6 h-80 w-full">
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
                        stroke={darkMode ? "#334155" : "#e2e8f0"}
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
                          backgroundColor: darkMode ? "#0f172a" : "#ffffff",
                          borderColor: darkMode ? "#334155" : "#e2e8f0",
                          borderRadius: "12px",
                          color: darkMode ? "#ffffff" : "#0f172a",
                        }}
                        formatter={(value) => [`${value}%`, "ATS Score"]}
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
                        strokeWidth={3}
                        dot={{
                          r: 5,
                          fill: "#2563eb",
                        }}
                        activeDot={{
                          r: 7,
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </section>

            <section className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Recent Analyses
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                  Your five most recent resume analyses.
                </p>
              </div>

              {recentAnalyses.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="text-5xl">📭</div>

                  <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">
                    No analyses yet
                  </h3>

                  <p className="mt-2 text-gray-500 dark:text-slate-400">
                    Analyze a resume to populate your dashboard.
                  </p>
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {recentAnalyses.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-4 rounded-xl bg-slate-50 dark:bg-slate-800 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950 text-xl">
                          📄
                        </div>

                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white break-all">
                            {item.filename}
                          </p>

                          <p className="text-sm text-gray-500 dark:text-slate-400">
                            {new Date(item.created_at).toLocaleString()}
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
    </div>
  );
}

function StatCard({ icon, title, value, small = false }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
      <div className="text-3xl">{icon}</div>

      <p className="mt-4 text-sm font-medium text-gray-500 dark:text-slate-400">
        {title}
      </p>

      <p
        className={`mt-2 font-bold text-slate-900 dark:text-white ${
          small ? "text-base break-words" : "text-3xl"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default Dashboard;