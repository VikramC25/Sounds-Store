import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin";
import PackPage from "./pages/PackPage";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Refund from "./pages/Refund";
import Shipping from "./pages/Shipping";
import Contact from "./pages/Contact";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Home Page</h1>} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/pack/:slug" element={<PackPage />} />

        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/refund" element={<Refund />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/contact" element={<Contact />} />

      </Routes>
    </BrowserRouter>
  );
}
