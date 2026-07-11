function LoadingOverlay({
  message = "Analyzing your resume...",
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white p-8 text-center shadow-2xl dark:bg-slate-900">
        <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600 dark:border-slate-700 dark:border-t-blue-500" />

        <h2 className="mt-6 text-2xl font-bold text-slate-900 dark:text-white">
          ResumeIQ
        </h2>

        <p className="mt-3 text-slate-600 dark:text-slate-300">
          {message}
        </p>

        <div className="mt-7 space-y-3 text-left text-sm text-slate-600 dark:text-slate-300">
          <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
            📄 Extracting resume text
          </div>

          <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
            🧠 Detecting technical skills
          </div>

          <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
            📊 Calculating ATS score
          </div>

          <div className="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
            ✨ Generating recommendations
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingOverlay;