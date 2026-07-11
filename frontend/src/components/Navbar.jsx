import { NavLink } from "react-router-dom";

function Navbar({ darkMode, toggleDarkMode }) {
  const linkClass = ({ isActive }) =>
    `transition ${
      isActive
        ? "text-blue-600 font-semibold"
        : "text-gray-600 dark:text-slate-300 hover:text-blue-600"
    }`;

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">ResumeIQ</h1>

          <p className="text-xs text-gray-500 dark:text-slate-400">
            AI Powered Resume Analyzer
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
          <NavLink to="/dashboard" className={linkClass}>
            Dashboard
          </NavLink>

          <NavLink to="/" end className={linkClass}>
            Resume Analyzer
          </NavLink>

          <NavLink to="/matcher" className={linkClass}>
            Job Matcher
          </NavLink>

          <NavLink to="/history" className={linkClass}>
            History
          </NavLink>

          <button
            type="button"
            onClick={toggleDarkMode}
            className="rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;