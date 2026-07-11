import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import JobMatcher from "./pages/JobMatcher";
import History from "./pages/History";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((currentMode) => {
      const nextMode = !currentMode;
      document.documentElement.classList.toggle("dark", nextMode);
      return nextMode;
    });
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/dashboard"
          element={
            <Dashboard
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          }
        />

        <Route
          path="/"
          element={
            <Home
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          }
        />

        <Route
          path="/matcher"
          element={
            <JobMatcher
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          }
        />

        <Route
          path="/history"
          element={
            <History
              darkMode={darkMode}
              toggleDarkMode={toggleDarkMode}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;