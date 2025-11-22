import { Link } from "react-router-dom";
import { Zap, DownloadCloud } from "lucide-react";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

export default function Shipping() {
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
            Shipping Policy
          </h1>

          <div className="flex flex-col md:flex-row gap-8 items-start">
             <div className="bg-white border-2 border-black p-6 w-full md:w-64 shrink-0 flex flex-col items-center text-center">
                <DownloadCloud size={48} className="mb-4 opacity-50" />
                <span className="font-bold uppercase tracking-widest text-xs">Delivery Method</span>
                <span className="text-xl font-bold mt-2">Instant Email</span>
             </div>

             <div className="space-y-6 leading-relaxed">
                <p className="text-lg font-bold">
                  We do not ship physical products.
                </p>
                <p>
                  This store sells <strong>digital audio files only</strong>. 
                </p>
                <p>
                  Immediately after purchase, you will be redirected to a download page. 
                  Simultaneously, an email containing your secure download link will be sent 
                  to the address you provided at checkout.
                </p>
                <p className="opacity-60 text-sm">
                  *If you do not receive your link within 5 minutes, please check your spam folder.
                </p>
             </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}