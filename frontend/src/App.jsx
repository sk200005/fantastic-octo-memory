import './App.css'
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home'
import Articles from './pages/Articles'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/articles" element={<Articles />} />
    </Routes>
  );
}

export default App