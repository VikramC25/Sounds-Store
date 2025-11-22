import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";
import { Zap, ArrowRight } from "lucide-react";
import Footer from "../components/Footer"; 
import { useCart } from "../context/CartContext"; // <--- IMPORT HOOK

export default function Home() {
  const packs = useQuery(api.packs.getAllPacks);
  const { toggleCart, cartItems } = useCart(); // <--- USE HOOK

  // ---------------- LOADING STATE ----------------
  if (!packs)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4d03f]">
        <div className="font-mono text-xl tracking-widest animate-pulse text-black">
          LOADING STORE...
        </div>
      </div>
    );

  return (
    <>
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');`}
      </style>

      <div
        className="min-h-screen text-black selection:bg-black selection:text-[#f4d03f] flex flex-col"
        style={{ fontFamily: '"Space Mono", monospace', backgroundColor: "#f4d03f" }}
      >
        {/* NAVBAR */}
        <nav className="border-b-2 border-black py-5 px-6 flex justify-between items-center sticky top-0 bg-[#f4d03f] z-50">
          <Link to ='/' className="font-bold text-xl tracking-tighter flex items-center gap-2">
            <Zap size={20} /> SOUND STORE
          </Link>
          
          {/* CART BUTTON */}
          <button 
            onClick={toggleCart} // Toggle cart on click
            className="text-sm font-bold uppercase hover:underline cursor-pointer"
          >
            Cart ({cartItems.length})
          </button>
        </nav>

        {/* HEADER */}
        <header className="border-b-2 border-black bg-[#f4d03f]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2">
            {/* Left */}
            <div className="p-6 lg:p-10 border-b-2 lg:border-b-0 lg:border-r-2 border-black flex items-center">
              <h1 className="text-4xl lg:text-6xl font-bold uppercase tracking-tighter leading-none">
                SOUNDS<br />FROM THE<br />FUTURE
              </h1>
            </div>
            {/* Right */}
            <div className="p-6 lg:p-10 flex flex-col justify-center gap-4">
              <p className="text-sm font-bold uppercase tracking-widest opacity-60 max-w-md leading-relaxed">
                High fidelity sample packs for the producers. 
              </p>
            </div>
          </div>
        </header>

        {/* GRID */}
        <main className="max-w-7xl mx-auto px-6 py-12 grow w-full">
          <div className="flex items-center justify-between mb-8 border-b-2 border-black pb-4">
            <span className="text-sm font-bold uppercase tracking-widest">
              Available Packs ({packs.length})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packs.map((pack) => (
              <Link 
                to={`/pack/${pack.slug}`} 
                key={pack._id}
                className="group block border-2 border-black bg-white/10 backdrop-blur-sm hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] transition-all duration-300"
              >
                <div className="relative aspect-square border-b-2 border-black overflow-hidden bg-black">
                  <img
                    src={pack.coverUrl}
                    alt={pack.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-[#f4d03f] text-black border-2 border-black px-3 py-1 text-xs font-bold uppercase tracking-widest">
                    {pack.price === 0 ? "FREE" : `₹${pack.price}`}
                  </div>
                </div>

                <div className="p-6 flex flex-col gap-4">
                  <div>
                    <h2 className="text-2xl font-bold uppercase tracking-tighter leading-none mb-1">
                      {pack.title}
                    </h2>
                    <span className="text-xs uppercase opacity-60 tracking-widest">
                      WAV / 24-BIT
                    </span>
                  </div>

                  <div className="w-full bg-black text-[#f4d03f] py-3 px-4 flex items-center justify-between font-bold uppercase text-sm group-hover:bg-gray-900 transition-colors">
                    <span>View Pack</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}