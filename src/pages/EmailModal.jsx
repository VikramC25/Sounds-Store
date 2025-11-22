import { useState } from "react";

export default function EmailModal({ isOpen, onClose, onSubmit, title }) {
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      onSubmit(email);
      setEmail(""); // Clear input on success
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Box */}
      <div className="relative z-[101] bg-[#1a1a1a] text-[#e0e0e0] p-6 rounded-lg shadow-2xl w-[400px] border border-white/10 font-sans">
        <h2 className="text-xl font-semibold mb-6">{title}</h2>
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=""
            className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-md p-3 text-[#e0e0e0] focus:outline-none focus:border-cyan-500 mb-8"
            autoFocus
            required
          />
          
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-full font-semibold bg-cyan-700 hover:bg-cyan-600 text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2 rounded-full font-semibold bg-cyan-400 hover:bg-cyan-300 text-black transition-colors"
            >
              OK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}