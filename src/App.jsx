  import { Routes, Route } from "react-router-dom";
  import Home from "./pages/Home";
  import PackPage from "./pages/PackPage";
  import Admin from "./pages/Admin";
  import ThankYou from "./pages/Thankyou";
  import CartDrawer from "./components/CartDrawer";
  import Privacy from "./pages/Privacy";
  import Terms from "./pages/Terms";
  import Refund from "./pages/Refund";
  import Shipping from "./pages/Shipping";
  import Contact from "./pages/Contact";

  function App() {
    return (
      <>
        <CartDrawer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pack/:slug" element={<PackPage />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/thank-you" element={<ThankYou />} />
          
          {/* Policy Routes */}
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </>
    );
  }

  export default App;