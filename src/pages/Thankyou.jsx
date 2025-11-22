import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { CheckCircle, ArrowLeft, Download } from "lucide-react";

export default function ThankYou() {
  const location = useLocation();
  
  // Support both single 'downloadUrl' (old flow) and 'downloadLinks' array (new cart flow)
  const singleUrl = location.state?.downloadUrl;
  const cartLinks = location.state?.downloadLinks;
  
  // Combine into one array for consistent handling
  const finalLinks = cartLinks || (singleUrl ? [{ title: location.state.title, url: singleUrl }] : []);

  const [status, setStatus] = useState("initializing"); 

  useEffect(() => {
    if (finalLinks.length === 0) return;

    async function processLinks() {
      setStatus("processing");

      // Process each link
      for (const item of finalLinks) {
        try {
          const res = await fetch(item.url);
          const text = await res.text();
          const match = text.match(/https?:\/\/\S+/);
          const zipUrl = match ? match[0] : null;

          if (zipUrl) {
            // Trigger download
            const a = document.createElement("a");
            a.href = zipUrl;
            a.download = "";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
        } catch (err) {
          console.error("Error auto-downloading:", err);
        }
      }
      setStatus("complete");
    }

    // Start after short delay
    const timer = setTimeout(processLinks, 1500);
    return () => clearTimeout(timer);
  }, [finalLinks]);

  if (finalLinks.length === 0) {
    return (
      <div className="min-h-screen bg-[#f4d03f] flex items-center justify-center font-mono">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">NO ORDER FOUND</h1>
          <Link to="/" className="underline">Return to Store</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4d03f] flex flex-col items-center justify-center font-mono text-black p-6">
      <div className="max-w-lg w-full bg-white/10 backdrop-blur-md border-2 border-black p-8 text-center shadow-[8px_8px_0px_rgba(0,0,0,1)]">
        
        <div className="flex justify-center mb-6">
          <CheckCircle size={64} className="text-black" />
        </div>

        <h1 className="text-3xl font-bold uppercase tracking-tighter mb-2">
          Order Confirmed!
        </h1>
        <p className="text-sm opacity-70 mb-8 uppercase tracking-widest">
          Thank you for your purchase
        </p>

        <div className="bg-black text-[#f4d03f] p-4 mb-8 text-sm font-bold uppercase tracking-widest">
          {status === "initializing" && "Preparing Files..."}
          {status === "processing" && "Starting Downloads..."}
          {status === "complete" && "Downloads Started!"}
        </div>

        {/* LIST OF ITEMS (Fallback if auto-download fails) */}
        <div className="text-left space-y-2 mb-8 border-t-2 border-black/10 pt-6">
           <p className="text-xs font-bold uppercase mb-2 text-center opacity-50">Your Packs:</p>
           {finalLinks.map((item, i) => (
             <div key={i} className="flex items-center justify-between bg-white/50 p-2 border border-black/10">
                <span className="text-xs font-bold truncate">{item.title}</span>
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs bg-black text-white px-2 py-1 uppercase hover:bg-gray-800"
                >
                  <Download size={12} />
                </a>
             </div>
           ))}
        </div>

        <p className="text-xs mb-8 leading-relaxed opacity-60">
          If downloads didn't start automatically, <br /> check your email or click the icons above.
        </p>

        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm font-bold uppercase hover:underline"
        >
          <ArrowLeft size={16} /> Back to Store
        </Link>
      </div>
    </div>
  );
}