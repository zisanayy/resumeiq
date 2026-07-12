import { useState } from "react";
import { NavLink } from "react-router-dom";

function Navbar({ darkMode, toggleDarkMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `relative rounded-xl px-3 py-2 text-sm font-medium transition-all duration-300 ${
      isActive
        ? "bg-blue-50 text-blue-700 shadow-sm dark:bg-blue-950 dark:text-blue-300"
        : "text-slate-600 hover:bg-slate-100 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-300"
    }`;

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-white/60 bg-white/80 shadow-sm backdrop-blur-xl transition-colors dark:border-slate-800/80 dark:bg-slate-950/80">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex min-h-20 items-center justify-between gap-4">
          <NavLink
            to="/"
            onClick={closeMobileMenu}
            className="group flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-xl font-bold text-white shadow-lg shadow-blue-500/20 transition-transform duration-300 group-hover:scale-105">
              R
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Resume<span className="text-blue-600">IQ</span>
              </h1>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                AI Powered Resume Analyzer
              </p>
            </div>
          </NavLink>

          <div className="hidden items-center gap-2 md:flex">
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
              className="ml-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-600 hover:shadow-md dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-blue-700 dark:hover:text-blue-300"
            >
              <span>{darkMode ? "☀️" : "🌙"}</span>
              <span>{darkMode ? "Light" : "Dark"}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((current) => !current)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-xl text-slate-700 shadow-sm transition hover:border-blue-300 hover:text-blue-600 md:hidden dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-slate-200/70 pb-5 pt-4 md:hidden dark:border-slate-800">
            <div className="grid gap-2">
              <NavLink
                to="/dashboard"
                className={linkClass}
                onClick={closeMobileMenu}
              >
                Dashboard
              </NavLink>

              <NavLink
                to="/"
                end
                className={linkClass}
                onClick={closeMobileMenu}
              >
                Resume Analyzer
              </NavLink>

              <NavLink
                to="/matcher"
                className={linkClass}
                onClick={closeMobileMenu}
              >
                Job Matcher
              </NavLink>

              <NavLink
                to="/history"
                className={linkClass}
                onClick={closeMobileMenu}
              >
                History
              </NavLink>

              <button
                type="button"
                onClick={() => {
                  toggleDarkMode();
                  closeMobileMenu();
                }}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <span>{darkMode ? "☀️" : "🌙"}</span>
                <span>
                  Switch to {darkMode ? "Light" : "Dark"} Mode
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;