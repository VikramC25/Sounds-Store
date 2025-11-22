import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

export default function Terms() {
  const { toggleCart, cartItems } = useCart();

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');`}</style>
      
      <div className="min-h-screen bg-[#f4d03f] text-black font-mono selection:bg-black selection:text-[#f4d03f] flex flex-col">
        
        {/* NAVBAR */}
        <nav className="border-b-2 border-black py-5 px-6 flex justify-between items-center sticky top-0 bg-[#f4d03f] z-50">
          <Link to="/" className="font-bold text-xl tracking-tighter flex items-center gap-2 hover:opacity-70 transition-opacity">
            <Zap size={20} /> SOUND STORE
          </Link>
          <button onClick={toggleCart} className="text-sm font-bold uppercase hover:underline cursor-pointer">
            Cart ({cartItems.length})
          </button>
        </nav>

        {/* CONTENT */}
        <main className="max-w-3xl mx-auto px-6 py-16 grow w-full">
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter mb-4 leading-none">
            Terms & Conditions
          </h1>
          <p className="text-sm font-bold uppercase opacity-50 tracking-widest mb-12 border-b-2 border-black pb-6">
            Last updated: January 2025
          </p>

          <div className="space-y-10 text-sm md:text-base leading-relaxed">
            <section>
              <p className="font-bold mb-4">00. INTRO</p>
              <p>
                Welcome to <strong>Sound Store</strong>. By accessing or purchasing from
                this website, you agree to these Terms & Conditions. Please read them carefully.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold uppercase tracking-widest mb-4 border-l-4 border-black pl-4">1. Digital Products</h2>
              <p>
                Sound Store sells downloadable digital files including sample packs, loops,
                one-shots, presets, and related audio content. No physical items are shipped.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold uppercase tracking-widest mb-4 border-l-4 border-black pl-4">2. Licensing & Usage</h2>
              <p className="mb-4">You are granted a non-exclusive license to use the sounds in your music:</p>
              <ul className="list-disc list-inside space-y-2 font-bold bg-white/20 p-4 border border-black">
                <li>Use in personal and commercial music projects</li>
                <li>Use in independent releases, social media, and content creation</li>
                <li>Edit, process, chop, and modify the sounds</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold uppercase tracking-widest mb-4 border-l-4 border-black pl-4">3. Major Label Restrictions</h2>
              <div className="bg-black text-[#f4d03f] p-4 border border-black mb-4">
                <p className="font-bold uppercase tracking-widest mb-2">⚠ Commercial Warning</p>
                <p>Our products are NOT royalty-free for major releases.</p>
              </div>
              <p>
                For releases under major labels, commercial placements, film/TV usage,
                or tracks exceeding 1 million total streams, you must request clearance:
                <br/><span className="font-bold underline">clearance@soundstore.com</span>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold uppercase tracking-widest mb-4 border-l-4 border-black pl-4">4. Prohibited Uses</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>Re-selling or uploading the packs elsewhere</li>
                <li>Redistributing or sharing the files</li>
                <li>Using the samples in your own sample packs</li>
                <li>Claiming the original recordings as your own</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold uppercase tracking-widest mb-4 border-l-4 border-black pl-4">5. Refund Policy</h2>
              <p>
                Because all products are digital, <strong>no refunds are issued</strong>.
                If you experienced a download issue, email us and we will resend your files.
              </p>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}