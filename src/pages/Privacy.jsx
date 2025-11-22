import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

export default function Privacy() {
  const { toggleCart, cartItems } = useCart();

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');`}</style>
      
      <div className="min-h-screen bg-[#f4d03f] text-black font-mono selection:bg-black selection:text-[#f4d03f] flex flex-col">
        
        <nav className="border-b-2 border-black py-5 px-6 flex justify-between items-center sticky top-0 bg-[#f4d03f] z-50">
          <Link to="/" className="font-bold text-xl tracking-tighter flex items-center gap-2 hover:opacity-70 transition-opacity">
            <Zap size={20} /> SOUND STORE
          </Link>
          <button onClick={toggleCart} className="text-sm font-bold uppercase hover:underline cursor-pointer">
            Cart ({cartItems.length})
          </button>
        </nav>

        <main className="max-w-3xl mx-auto px-6 py-16 grow w-full">
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-8 leading-none">
            Privacy Policy
          </h1>
          
          <div className="space-y-8 text-sm md:text-base leading-relaxed border-l-2 border-black pl-6">
            <p className="text-lg font-bold">
              We respect your privacy. Period.
            </p>
            <p>
              This website collects only the information required to process your orders 
              (email address and payment confirmation). We do not sell, trade, or 
              rent your personal identification information to others.
            </p>
            <p>
              <strong>Payments:</strong> All transactions are processed securely through Razorpay. 
              We do not store your credit card or banking details on our servers.
            </p>
            <p>
              <strong>Cookies:</strong> We use minimal local storage to remember your cart items 
              so you don't lose them if you refresh the page. That's it.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}