import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import JobMatcher from "./pages/JobMatcher";
import History from "./pages/History";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);

    if (!darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
        />
        <Route
          path="/matcher"
          element={
            <JobMatcher darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          }
        />
        <Route
          path="/history"
          element={
            <History darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;