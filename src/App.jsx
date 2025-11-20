import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin";
import PackPage from "./pages/PackPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/pack/:slug" element={<PackPage />} />

      </Routes>
    </BrowserRouter>
  );
}
