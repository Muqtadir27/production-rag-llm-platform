import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Technology from "./pages/Technology";
import UseCases from "./pages/UseCases";
import Integration from "./pages/Integration";
import Connect from "./pages/Connect";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/technology" element={<Technology />} />
        <Route path="/use-cases" element={<UseCases />} />
        <Route path="/integration" element={<Integration />} />
        <Route path="/connect" element={<Connect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
