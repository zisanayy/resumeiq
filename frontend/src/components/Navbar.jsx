import { Link } from "react-router-dom";

function Navbar({ darkMode, toggleDarkMode }) {
  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">ResumeIQ</h1>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            AI Powered Resume Analyzer
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-slate-300">
          <Link to="/" className="hover:text-blue-600 transition">
            Resume Analyzer
          </Link>

          <Link to="/matcher" className="hover:text-blue-600 transition">
            Job Matcher
          </Link>

          <Link to="/history" className="hover:text-blue-600 transition">
            History
          </Link>

          <button
            onClick={toggleDarkMode}
            className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;