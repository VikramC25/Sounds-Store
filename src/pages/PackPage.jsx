import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useParams, useNavigate, Link } from "react-router-dom"; 
import { useState } from "react";
import { ShoppingCart, Disc, Zap } from "lucide-react";
import EmailModal from "./EmailModal"
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

export default function PackPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleCart, cartItems } = useCart();

  const [isModalOpen, setModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const createOrder = useMutation(api.payments.createOrder);
  const attachRzp = useMutation(api.payments.attachRzp);
  const markPaid = useMutation(api.payments.markPaid);
  const createRzpOrder = useAction(api.payments.createRazorpayOrder);

  const pack = useQuery(api.packs.getPackBySlug, { slug });

  const coverUrl = useQuery(
    api.files.getFileUrl,
    pack?.coverFileId ? { fileId: pack.coverFileId } : "skip"
  );

  const snippetUrls = useQuery(
    api.files.getMultipleFileUrls,
    pack?.snippets ? { snippetIds: pack.snippets } : "skip"
  );

  function openFreeDownloadModal() {
    setPendingAction("free");
    setModalOpen(true);
  }

  async function processFreeDownload(email) {
    setModalOpen(false);
    try {
      const orderId = await createOrder({ email, packId: pack._id, amount: 0 });
      const result = await markPaid({ orderId, paymentId: "FREE_DOWNLOAD" });
      if (result.downloadUrl) {
        navigate("/thank-you", { 
          state: { downloadUrl: result.downloadUrl, title: pack.title } 
        });
      }
    } catch (err) {
      console.error("Free download error:", err);
      alert("Something went wrong with the free download.");
    }
  }
  
  function openBuyNowModal() {
    setPendingAction("buy");
    setModalOpen(true);
  }

  async function processBuyNow(email) {
    setModalOpen(false); 
    try {
      const orderId = await createOrder({ email, packId: pack._id, amount: pack.price });
      const rzpOrder = await createRzpOrder({ amount: pack.price, receipt: orderId });
      await attachRzp({ orderId, razorpayOrderId: rzpOrder.id });
      
      const rzp = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: rzpOrder.amount,
        currency: "INR",
        name: pack.title,
        description: "Sound Pack Purchase",
        order_id: rzpOrder.id,
        prefill: { email },
        handler: async function (response) {
           const result = await markPaid({ orderId, paymentId: response.razorpay_payment_id });
           if (result.downloadUrl) {
             navigate("/thank-you", { state: { downloadUrl: result.downloadUrl, title: pack.title } });
           }
        },
      });
      rzp.open();
    } catch (err) {
      console.error("Purchase initialization error:", err);
      alert("Could not initialize payment.");
    }
  }

  if (!pack || !coverUrl || !snippetUrls)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4d03f]">
        <div className="font-mono text-xl tracking-widest animate-pulse">
          LOADING ASSETS...
        </div>
      </div>
    );

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
          audio::-webkit-media-controls-overflow-button, 
          audio::-webkit-media-controls-more-button {
            display: none !important;
          }
        `}
      </style>

      <div
        className="min-h-screen text-black selection:bg-black selection:text-[#f4d03f] flex flex-col"
        style={{ fontFamily: '"Space Mono", monospace', backgroundColor: "#f4d03f" }}
      >
        <EmailModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          title="Enter your email:"
          onSubmit={(email) => {
            if (pendingAction === "free") {
              processFreeDownload(email);
            } else {
              processBuyNow(email);
            }
          }}
        />

        {/* NAVBAR */}
        <nav className="border-b-2 border-black py-5 px-6 flex justify-between items-center sticky top-0 bg-[#f4d03f] z-50">
          
          {/* --- UPDATED LOGO LINK HERE --- */}
          <Link to="/" className="font-bold text-xl tracking-tighter flex items-center gap-2 hover:opacity-70 transition-opacity">
            <Zap size={20} /> SOUND STORE
          </Link>
          
          <button 
            onClick={toggleCart}
            className="text-sm font-bold uppercase hover:underline cursor-pointer"
          >
            Cart ({cartItems.length})
          </button>
        </nav>

        <main className="max-w-6xl mx-auto px-6 py-12 lg:py-20 grow w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="relative">
                <div className="absolute inset-0 translate-x-2 translate-y-2 bg-black w-full h-full" />
                <img
                  src={coverUrl}
                  className="relative z-10 w-full aspect-square object-cover border-2 border-black grayscale hover:grayscale-0 transition-all duration-500"
                  alt={pack.title}
                />
              </div>
              <div className="border-2 border-black p-4 text-xs uppercase tracking-widest space-y-3 bg-white/10 backdrop-blur-sm">
                 <div className="flex justify-between border-b border-black pb-2">
                  <span className="opacity-60">Format</span>
                  <span className="font-bold">WAV 24-Bit</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 flex flex-col h-full pl-0 lg:pl-10">
              <div className="mb-2 text-xs font-bold uppercase tracking-[0.2em] opacity-60">
                © SOUND STORE / LIMITED COPIES
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold uppercase tracking-tighter mb-6 leading-none">
                {pack.title}
              </h1>

              <div className="mb-10 font-mono">
                <span className="text-4xl font-bold">
                  {pack.price === 0 ? "FREE" : `₹${pack.price}`}
                </span>
              </div>

              <div className="space-y-3 mb-12 max-w-md">
                <button 
                  onClick={() => addToCart({
                    _id: pack._id,
                    title: pack.title,
                    price: pack.price,
                    coverUrl: coverUrl
                  })}
                  className="cursor-pointer w-full bg-black text-[#f4d03f] h-14 px-6 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-900 transition-transform active:scale-[0.98] shadow-[4px_4px_0px_rgba(255,255,255,0.5)]"
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>

                {pack.price === 0 ? (
                  <button
                    onClick={openFreeDownloadModal} 
                    className="cursor-pointer w-full bg-black text-[#f4d03f] h-14 px-6 text-sm font-bold uppercase tracking-widest"
                  >
                    Download Free Pack
                  </button>
                ) : (
                  <button
                    onClick={openBuyNowModal}
                    className="cursor-pointer w-full bg-black text-[#f4d03f] h-14 px-6 text-sm font-bold uppercase tracking-widest"
                  >
                    Buy Now
                  </button>
                )}
              </div>

              <div className="mb-12 border-l-2 border-black pl-4">
                <p className="text-sm font-bold mb-2 lowercase">:: detailed specs</p>
                <p className="text-lg leading-relaxed max-w-xl">{pack.description}</p>
              </div>

              <div className="grow">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2 border-b-2 border-black pb-2 w-full">
                  <Disc size={14} />
                  Composition Previews
                </h3>

                <div className="space-y-4">
                  {snippetUrls.map((url, i) => (
                    <div key={i}>
                      <span className="text-xs font-bold uppercase block mb-1">
                        Preview_0{i + 1}.wav
                      </span>
                      <audio
                        controls
                        controlsList="nodownload noplaybackrate"
                        src={url}
                        className="w-full h-10"
                        style={{
                          filter:
                            "sepia(100%) saturate(100%) hue-rotate(5deg) contrast(1.2) invert(1)",
                        }}
                      />
                    </div>
                  ))}
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