import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Upload, Music, FileText, Image as ImageIcon, Lock } from "lucide-react";

export default function Admin() {
  const navigate = useNavigate();

  // --- AUTH STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  // --- FORM STATE ---
  const getUploadUrl = useMutation(api.admin.getUploadUrl);
  const createPack = useMutation(api.admin.createPack);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [cover, setCover] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const [snippets, setSnippets] = useState([]);
  const [snippetPreviews, setSnippetPreviews] = useState([]);

  const [packTxt, setPackTxt] = useState(null);

  // Drag states
  const [isDraggingCover, setIsDraggingCover] = useState(false);
  const [isDraggingSnippets, setIsDraggingSnippets] = useState(false);
  const [isDraggingTxt, setIsDraggingTxt] = useState(false);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // -------------------- AUTH HANDLER ---------------------
  function handleLogin(e) {
    e.preventDefault();
    // Client-side check to reveal the UI. 
    // The REAL security happens on the backend using this same password.
    if (password.trim().length > 0) {
      setIsAuthenticated(true);
    } else {
      alert("Please enter the Admin Key");
    }
  }

  // -------------------- FILE HANDLERS ---------------------

  function handleCoverUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setCover(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  function handleSnippetsUpload(e) {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setSnippets(files);
    setSnippetPreviews(files.map((f) => URL.createObjectURL(f)));
  }

  // Upload ANY file to Convex Storage
  async function uploadFile(file) {
    const url = await getUploadUrl();
    const res = await fetch(url, {
      method: "POST",
      body: file,
    });
    const json = await res.json();
    return json.storageId;
  }

  // -------------------- SUBMIT PACK ---------------------

  async function submitPack() {
    if (!title || !description || !price || !cover || !packTxt) {
      alert("Please fill all fields and upload all required files.");
      return;
    }

    setLoading(true);
    setStatus("Uploading files to storage...");

    try {
      // 1. Upload Files First
      const slug = title.toLowerCase().replace(/\s+/g, "-");
      const coverId = await uploadFile(cover);
      
      const snippetIds = await Promise.all(
        snippets.map((file) => uploadFile(file))
      );
      
      const fullPackFileId = await uploadFile(packTxt);

      setStatus("Verifying Key & Saving to Database...");

      // 2. Save to DB (Pass the 'password' state as 'adminSecret')
      const result = await createPack({
        title,
        slug,
        description,
        price: Number(price),
        coverFileId: coverId,
        snippets: snippetIds,
        fullPackFileId,
        tags: [],
        createdAt: Date.now(),
        adminSecret: password, // <--- CRITICAL: Sends your key to backend
      });

      setStatus("Pack Created! Redirecting...");
      setTimeout(() => {
        navigate(`/pack/${slug}`);
      }, 1000);

    } catch (err) {
      console.error(err);
      // If backend rejects the password, this error triggers
      alert("Upload Failed! Does your password match the ADMIN_SECRET in Convex Dashboard?");
      setStatus("Error: Access Denied or Upload Failed.");
    }
    setLoading(false);
  }

  // -------------------- STYLES ------------------------
  const zoneClass = (isDragging) => 
    `border-2 border-dashed border-black p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
      isDragging ? "bg-black text-[#f4d03f]" : "bg-white/50 hover:bg-white text-black"
    }`;

  const inputClass = "w-full bg-white border-2 border-black p-4 font-bold placeholder:font-normal focus:outline-none focus:shadow-[4px_4px_0px_#000] transition-shadow";
  
  // -------------------- RENDER: 1. LOCK SCREEN ------------------------
  if (!isAuthenticated) {
    return (
      <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');`}</style>
      <div className="min-h-screen bg-[#f4d03f] flex flex-col items-center justify-center font-mono p-6 text-black">
        <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_#000] max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="bg-black text-[#f4d03f] p-3 rounded-full">
              <Lock size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-6 uppercase tracking-tighter">Restricted Access</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-xs text-center opacity-60 font-bold uppercase mb-2">
              Enter ADMIN_SECRET Key
            </div>
            <input 
              type="password" 
              placeholder="Enter Key..." 
              className={inputClass}
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
            />
            <button className="w-full bg-black text-[#f4d03f] h-12 font-bold uppercase tracking-widest hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0px_rgba(255,255,255,0.5)] transition-all">
              Unlock Dashboard
            </button>
            <Link to="/" className="block text-center text-xs font-bold uppercase underline mt-4">
              Back to Store
            </Link>
          </form>
        </div>
      </div>
      </>
    );
  }

  // -------------------- RENDER: 2. ADMIN DASHBOARD ------------------------
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');`}</style>
      
      <div className="min-h-screen bg-[#f4d03f] font-mono text-black p-6 lg:p-12">
        <div className="max-w-3xl mx-auto">
          
          {/* HEADER */}
          <div className="flex items-center justify-between mb-10">
            <Link to="/" className="flex items-center gap-2 font-bold uppercase hover:underline">
              <ArrowLeft size={20} /> Back Home
            </Link>
            <h1 className="text-xl lg:text-2xl font-bold uppercase tracking-widest border-b-2 border-black pb-1">
              Admin Dashboard
            </h1>
          </div>

          <div className="bg-white/20 backdrop-blur-sm border-2 border-black p-6 lg:p-10 shadow-[8px_8px_0px_#000]">
            
            {/* TITLE */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-widest mb-2">Pack Title</label>
              <input className={inputClass} placeholder="Pack Name" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            {/* DESCRIPTION */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-widest mb-2">Description</label>
              <textarea rows={4} className={inputClass} placeholder="Describe the pack..." value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            {/* PRICE */}
            <div className="mb-10">
              <label className="block text-xs font-bold uppercase tracking-widest mb-2">Price (INR)</label>
              <input type="number" className={inputClass} placeholder="499" value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>

            {/* --- FILE ZONES --- */}
            <div className="grid gap-8">
              
              {/* COVER */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2">1. Cover Image</label>
                <div
                  className={zoneClass(isDraggingCover)}
                  onClick={() => document.getElementById("coverInput").click()}
                  onDragEnter={(e) => { e.preventDefault(); setIsDraggingCover(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDraggingCover(false); }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); setIsDraggingCover(false); handleCoverUpload({ target: { files: [e.dataTransfer.files[0]] } }); }}
                >
                  <ImageIcon size={32} className="opacity-50" />
                  <p className="font-bold text-sm">{cover ? cover.name : "Drop Image or Click"}</p>
                </div>
                {coverPreview && <img src={coverPreview} className="w-32 h-32 object-cover border-2 border-black mt-4 shadow-[4px_4px_0px_#000]" />}
                <input id="coverInput" type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
              </div>

              {/* SNIPPETS */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2">2. Audio Previews (MP3)</label>
                <div
                  className={zoneClass(isDraggingSnippets)}
                  onClick={() => document.getElementById("snippetsInput").click()}
                  onDragEnter={(e) => { e.preventDefault(); setIsDraggingSnippets(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDraggingSnippets(false); }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); setIsDraggingSnippets(false); handleSnippetsUpload({ target: { files: Array.from(e.dataTransfer.files) } }); }}
                >
                  <Music size={32} className="opacity-50" />
                  <p className="font-bold text-sm">{snippets.length ? `${snippets.length} Files Selected` : "Drop MP3s or Click"}</p>
                </div>
                {snippetPreviews.length > 0 && (
                  <div className="mt-4 space-y-2 border-2 border-black p-4 bg-white">
                    {snippetPreviews.map((url, i) => <audio key={i} controls src={url} className="w-full h-8" />)}
                  </div>
                )}
                <input id="snippetsInput" type="file" accept="audio/mpeg" multiple className="hidden" onChange={handleSnippetsUpload} />
              </div>

              {/* TXT FILE */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2">3. Secure Content (TXT)</label>
                <div
                  className={zoneClass(isDraggingTxt)}
                  onClick={() => document.getElementById("txtInput").click()}
                  onDragEnter={(e) => { e.preventDefault(); setIsDraggingTxt(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDraggingTxt(false); }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); setIsDraggingTxt(false); setPackTxt(e.dataTransfer.files[0]); }}
                >
                  <FileText size={32} className="opacity-50" />
                  <p className="font-bold text-sm">{packTxt ? packTxt.name : "Drop TXT (with Link)"}</p>
                </div>
                <input id="txtInput" type="file" accept=".txt" className="hidden" onChange={(e) => setPackTxt(e.target.files[0])} />
              </div>

            </div>

            {/* SUBMIT BUTTON */}
            <button
              onClick={submitPack}
              disabled={loading}
              className={`mt-12 w-full bg-black text-[#f4d03f] h-16 text-xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gray-900 active:scale-[0.99] transition-all shadow-[6px_6px_0px_rgba(255,255,255,0.5)] ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Uploading..." : <><Upload size={24} /> Create Pack</>}
            </button>

            {status && <p className="mt-6 text-center font-bold bg-white border border-black p-3">{status}</p>}
          </div>
        </div>
      </div>
    </>
  );
}