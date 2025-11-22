import { Link } from "react-router-dom";
import { Zap, Mail, Globe } from "lucide-react";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

export default function Contact() {
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

        <main className="max-w-2xl mx-auto px-6 py-20 grow w-full flex flex-col justify-center">
          <div className="border-2 border-black bg-white/20 p-8 lg:p-12 shadow-[8px_8px_0px_#000]">
            <h1 className="text-4xl font-bold uppercase tracking-tighter mb-8 text-center">
              Contact Us
            </h1>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-black text-[#f4d03f] p-3">
                  <Mail size={24} />
                </div>
                <div>
                  <h2 className="font-bold uppercase tracking-widest text-sm opacity-60 mb-1">Email Support</h2>
                  <a href="mailto:vikrambeyblade@gmail.com" className="text-lg font-bold hover:underline break-all">
                    vikrambeyblade@gmail.com
                  </a>
                  <p className="text-xs mt-2 opacity-70">We usually reply within 24 hours.</p>
                </div>
              </div>

              <div className="border-t border-black opacity-20 my-6"></div>

              <div className="flex items-start gap-4">
                <div className="bg-black text-[#f4d03f] p-3">
                  <Globe size={24} />
                </div>
                <div>
                  <h2 className="font-bold uppercase tracking-widest text-sm opacity-60 mb-1">Website</h2>
                  <a href="https://sound-store.pages.dev" target="_blank" className="text-lg font-bold hover:underline">
                    sound-store.pages.dev
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}