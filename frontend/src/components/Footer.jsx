import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-white/70 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Resume<span className="text-blue-600">IQ</span>
          </h2>

          <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            AI-powered resume analysis, ATS scoring and job matching
            for stronger career applications.
          </p>
        </div>

        <div>
          <h3 className="font-bold text-slate-900 dark:text-white">
            Product
          </h3>

          <div className="mt-4 grid gap-3 text-sm">
            <Link
              to="/"
              className="text-slate-500 transition hover:text-blue-600 dark:text-slate-400"
            >
              Resume Analyzer
            </Link>

            <Link
              to="/matcher"
              className="text-slate-500 transition hover:text-blue-600 dark:text-slate-400"
            >
              Job Matcher
            </Link>

            <Link
              to="/dashboard"
              className="text-slate-500 transition hover:text-blue-600 dark:text-slate-400"
            >
              Dashboard
            </Link>

            <Link
              to="/history"
              className="text-slate-500 transition hover:text-blue-600 dark:text-slate-400"
            >
              History
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-slate-900 dark:text-white">
            Built With
          </h3>

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              "React",
              "FastAPI",
              "Tailwind CSS",
              "SQLite",
              "SQLAlchemy",
            ].map((technology) => (
              <span
                key={technology}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              >
                {technology}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200/70 dark:border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between dark:text-slate-400">
          <p>
            © {new Date().getFullYear()} ResumeIQ. All rights reserved.
          </p>

          <p>
            Built with React and FastAPI.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;