import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t-2 border-black mt-auto bg-[#f4d03f] text-black font-mono">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* MAIN CONTENT */}
        {/* Changed from GRID to FLEX to center the columns together nicely */}
        <div className="flex flex-col md:flex-row justify-center gap-12 md:gap-64 mb-16">
          
          {/* LEFT COLUMN: POLICIES */}
          <div className="flex flex-col gap-4 items-start text-left">
            <span className="font-bold uppercase text-xs opacity-50 tracking-widest mb-2">
              Legal & Support
            </span>
            <Link to="/privacy" className="hover:underline uppercase text-sm font-bold">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:underline uppercase text-sm font-bold">
              Terms & Conditions
            </Link>
            <Link to="/refund" className="hover:underline uppercase text-sm font-bold">
              Refund Policy
            </Link>
            <Link to="/shipping" className="hover:underline uppercase text-sm font-bold">
              Shipping Policy
            </Link>
          </div>

          {/* RIGHT COLUMN: SOCIALS */}
          <div className="flex flex-col gap-4 items-start text-left">
            <span className="font-bold uppercase text-xs opacity-50 tracking-widest mb-2">
              Social
            </span>
            <a href="https://www.instagram.com/ninja_blader/" target="_blank" rel="noreferrer" className="hover:underline uppercase text-sm font-bold">
              Instagram
            </a>
            <a href="https://x.com/WBOVikram" target="_blank" rel="noreferrer" className="hover:underline uppercase text-sm font-bold">
              Twitter
            </a>
          </div>
        </div>

        {/* BOTTOM: CONTACT */}
        {/* Center the contact link to match the centered columns above */}
        <div className="max-w-3xl mx-auto border-t border-black pt-8 flex justify-center">
          <Link to="/contact" className="text-xs font-bold uppercase hover:underline tracking-widest">
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
}