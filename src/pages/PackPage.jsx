import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { ShoppingCart, Disc, Zap, ArrowRight } from "lucide-react";

export default function PackPage() {
  const { slug } = useParams();

  // --- DATA FETCHING ---
  const pack = useQuery(api.packs.getPackBySlug, { slug });

  const coverUrl = useQuery(
    api.files.getFileUrl,
    pack?.coverFileId ? { fileId: pack.coverFileId } : "skip"
  );

  const snippetUrls = useQuery(
    api.files.getMultipleFileUrls,
    pack?.snippets ? { snippetIds: pack.snippets } : "skip"
  );

  const txtFileUrl = useQuery(
    api.files.getFileUrl,
    pack?.fullPackFileId ? { fileId: pack.fullPackFileId } : "skip"
  );

  const [zipUrl, setZipUrl] = useState("");

  // Extract ZIP URL logic
  useEffect(() => {
    if (!txtFileUrl) return;
    async function loadTxt() {
      try {
        const res = await fetch(txtFileUrl);
        const text = await res.text();
        const match = text.match(/https?:\/\/\S+/);
        if (match) setZipUrl(match[0]);
      } catch (e) {
        console.error("TXT error", e);
      }
    }
    loadTxt();
  }, [txtFileUrl]);

  // --- LOADING STATE ---
  if (!pack || !coverUrl || !snippetUrls)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4d03f]">
        <div className="font-mono text-xl tracking-widest animate-pulse">LOADING ASSETS...</div>
      </div>
    );

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
          
          /* Hides the three dots / overflow menu on Chrome/Safari/Edge */
          audio::-webkit-media-controls-overflow-button,
          audio::-webkit-media-controls-more-button {
            display: none !important;
          }
        `}
      </style>

      <div 
        className="min-h-screen text-black selection:bg-black selection:text-[#f4d03f] flex flex-col"
        style={{ fontFamily: '"Space Mono", monospace', backgroundColor: '#f4d03f' }}
      >
        
        {/* Navbar */}
        <nav className="border-b-2 border-black py-5 px-6 flex justify-between items-center sticky top-0 bg-[#f4d03f] z-50">
          <span className="font-bold text-xl tracking-tighter flex items-center gap-2">
            <Zap size={20} fill="black" /> 2025_SAMPLES
          </span>
          <button className="text-sm font-bold uppercase hover:underline cursor-pointer">
            Cart (0)
          </button>
        </nav>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-12 lg:py-20 grow w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* --- LEFT COLUMN: IMAGE & TECH SPECS --- */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="relative">
                <div className="absolute inset-0 translate-x-2 translate-y-2 bg-black w-full h-full" />
                <img
                  src={coverUrl}
                  className="relative z-10 w-full aspect-square object-cover border-2 border-black grayscale hover:grayscale-0 transition-all duration-500"
                  alt={pack.title}
                />
              </div>

              <div className="border-2 border-black p-4 bg-white/10 backdrop-blur-sm text-xs uppercase tracking-widest space-y-3">
                <div className="flex justify-between border-b border-black pb-2">
                  <span className="opacity-60">Format</span>
                  <span className="font-bold">WAV 24-Bit</span>
                </div>
                <div className="flex justify-between border-b border-black pb-2">
                  <span className="opacity-60">Total Files</span>
                  <span className="font-bold">{snippetUrls.length * 8 + 15} Files</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">License</span>
                  <span className="font-bold">Royalty Free</span>
                </div>
              </div>
            </div>

            {/* --- RIGHT COLUMN: INFO --- */}
            <div className="lg:col-span-7 flex flex-col h-full pl-0 lg:pl-10">
              <div className="mb-2 text-xs font-bold uppercase tracking-[0.2em] opacity-60">
                © 2025 SAMPLES / LIMITED COPIES
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold uppercase tracking-tighter mb-6 leading-none">
                {pack.title}
              </h1>

              <div className="mb-10 font-mono">
                <div className="flex flex-col items-start">
                  <span className="text-4xl font-bold">
                    ${pack.price}
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-12 max-w-md">
                <button className="cursor-pointer w-full bg-black text-[#f4d03f] h-14 px-6 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-900 transition-transform active:scale-[0.98] shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)]">
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
                
                <button className="cursor-pointer w-full border-2 border-black bg-transparent text-black h-14 px-6 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-[#f4d03f] transition-all active:scale-[0.98]">
                  Buy Now
                </button>
              </div>

              <div className="mb-12 border-l-2 border-black pl-4">
                 <p className="text-sm font-bold mb-2 lowercase">:: detailed specs</p>
                 <p className="text-lg leading-relaxed max-w-xl">
                  {pack.description}
                 </p>
              </div>

              <div className="grow">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2 border-b-2 border-black pb-2 w-full">
                  <Disc size={14} />
                  Composition Previews
                </h3>
                
                <div className="space-y-4">
                  {snippetUrls.map((url, i) => (
                    <div key={i} className="group">
                      <div className="flex justify-between items-center mb-1 px-1">
                        <span className="text-xs font-bold uppercase">Preview_0{i + 1}.wav</span>
                      </div>
                      <audio 
                        controls 
                        controlsList="nodownload noplaybackrate"
                        src={url} 
                        className="w-full h-10 cursor-pointer block"
                        style={{ 
                          filter: 'sepia(100%) saturate(100%) hue-rotate(5deg) contrast(1.2) invert(1)',
                          outline: 'none'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>

{/* --- FOOTER SECTION (UPDATED) --- */}
<footer className="border-t-2 border-black mt-20 bg-[#f4d03f] text-black">
          <div className="max-w-7xl mx-auto px-6 py-12">
            
            {/* Links Grid - Now Centered/Main */}
            <div className="grid grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
              {/* Support Column */}
              <div className="flex flex-col gap-4">
                <span className="font-bold uppercase mb-2 text-xs opacity-50">Support</span>
                <a href="#" className="hover:underline uppercase text-sm font-bold">Privacy</a>
                <a href="#" className="hover:underline uppercase text-sm font-bold">Terms + Conditions</a>
              </div>
              
              {/* Social Column */}
              <div className="flex flex-col gap-4">
                <span className="font-bold uppercase mb-2 text-xs opacity-50">Social</span>
                <a href="#" className="hover:underline uppercase text-sm font-bold">Instagram</a>
                <a href="#" className="hover:underline uppercase text-sm font-bold">Twitter</a>
                <a href="#" className="hover:underline uppercase text-sm font-bold">YouTube</a>
              </div>
            </div>
              
            {/* Bottom Bar */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 max-w-4xl mx-auto border-t border-black pt-8">

              <a href="#" className="text-xs font-bold uppercase hover:underline">
                Contact Us
              </a>
            </div>

          </div>
        </footer>

      </div>
    </>
  );
}