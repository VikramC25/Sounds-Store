import { Link } from "react-router-dom";
import { Zap, AlertTriangle } from "lucide-react";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

export default function Refund() {
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
            Refund Policy
          </h1>
          
          <div className="bg-black text-[#f4d03f] p-6 border-2 border-black shadow-[8px_8px_0px_rgba(0,0,0,0.2)] mb-8 flex gap-4 items-start">
            <AlertTriangle className="shrink-0 mt-1" />
            <div>
              <h3 className="font-bold uppercase tracking-widest mb-2">Digital Product Notice</h3>
              <p>All sample packs and digital downloads are delivered instantly.</p>
            </div>
          </div>

          <div className="space-y-6 leading-relaxed">
            <p>
              Due to the nature of digital products, <strong>we cannot offer refunds or exchanges</strong> once a purchase is complete and files have been sent. 
              Unlike physical goods, digital files cannot be "returned."
            </p>
            <p>
              <strong>Exceptions:</strong> If you have a technical issue (e.g., duplicate purchase, corrupt file, or download link failure), 
              please contact us immediately at <span className="font-bold underline">vikrambeyblade@email.com</span>. 
              We will verify the issue and ensure you receive your files.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}