import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import News from "./pages/News";
import SmoothScroll from "./components/SmoothScroll";

function App() {
  return (
    <SmoothScroll>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/news" element={<News />} />
      </Routes>
    </SmoothScroll>
  );
}

export default App;
