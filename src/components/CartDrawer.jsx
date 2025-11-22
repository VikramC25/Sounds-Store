import { X, Trash2, Lock } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useNavigate } from "react-router-dom";

export default function CartDrawer() {
  const { cartItems, isCartOpen, toggleCart, removeFromCart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  // Checkout State
  const [email, setEmail] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Backend Hooks
  const createCartEntries = useMutation(api.payments.createCartEntries);
  const createRzpOrder = useAction(api.payments.createRazorpayOrder);
  const attachCartRzp = useMutation(api.payments.attachCartRzp);
  const markCartPaid = useMutation(api.payments.markCartPaid);

  // --- CHECKOUT HANDLER ---
  async function handleCheckout() {
    if (!email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create DB Entries
      const itemsPayload = cartItems.map(item => ({
        packId: item._id,
        amount: item.price
      }));
      
      const orderIds = await createCartEntries({
        email,
        items: itemsPayload
      });

      // 2. Create Razorpay Order
      const rzpOrder = await createRzpOrder({
        amount: cartTotal,
        receipt: "cart_bundle",
      });

      // 3. Link them
      await attachCartRzp({
        orderIds,
        razorpayOrderId: rzpOrder.id,
      });

      // 4. Open Razorpay
      const rzp = new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: rzpOrder.amount,
        currency: "INR",
        name: "2025 SAMPLES",
        description: `Checkout - ${cartItems.length} Items`,
        order_id: rzpOrder.id,
        prefill: { email },
        handler: async function (response) {
          // 5. Success: Mark Paid & Redirect
          const downloadLinks = await markCartPaid({
            razorpayOrderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
          });

          clearCart(); // Empty the cart
          toggleCart(); // Close drawer
          
          // Go to Thank You page with ALL links
          navigate("/thank-you", { 
            state: { downloadLinks } 
          });
        },
      });

      rzp.open();
      
    } catch (err) {
      console.error("Checkout Error:", err);
      alert("Checkout failed. Please try again.");
    }
    
    setIsProcessing(false);
  }

  return (
    <>
      {/* OVERLAY: Force Z-Index to 99999 */}
      <div
        style={{ zIndex: 99999 }}
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ${
          isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleCart}
      />

      {/* DRAWER: Force Z-Index to 100000 (Above overlay and EVERYTHING else) */}
      <div
        style={{ zIndex: 100000 }}
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col font-mono text-black ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            Your Cart <span className="bg-black text-white px-2 py-0.5 text-xs rounded-full">{cartItems.length}</span>
          </h2>
          <button onClick={toggleCart} className="hover:opacity-50 transition-opacity">
            <X size={24} />
          </button>
        </div>

        {/* CART ITEMS LIST */}
        <div className="grow overflow-y-auto p-6 bg-[#fafafa]">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-40 text-center gap-4">
              <p className="text-sm uppercase tracking-widest">Cart Empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex gap-4 items-start bg-white p-3 border border-gray-200 shadow-sm">
                  <div className="w-16 h-16 bg-gray-100 overflow-hidden border border-gray-200 shrink-0">
                     {item.coverUrl && (
                        <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover" />
                     )}
                  </div>
                  
                  <div className="grow">
                    <h3 className="font-bold uppercase text-sm leading-tight mb-1">{item.title}</h3>
                    <p className="text-[10px] opacity-60 uppercase tracking-wider">WAV / 24-Bit</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span className="font-bold text-sm">
                        {item.price === 0 ? "FREE" : `₹${item.price}`}
                    </span>
                    <button 
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-500 opacity-50 hover:opacity-100 transition-opacity"
                    >
                        <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER / CHECKOUT */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-200 bg-white shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
            
            {/* EMAIL INPUT FOR GUEST CHECKOUT */}
            <div className="mb-6">
              <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-500">
                Contact Email (For Download Link)
              </label>
              <input 
                type="email" 
                placeholder="producer@example.com"
                className="w-full border-2 border-black p-3 text-sm font-bold placeholder:font-normal focus:outline-none focus:bg-yellow-50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex justify-between items-center mb-4 font-bold text-lg">
              <span>Total</span>
              <span>₹{cartTotal}</span>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full bg-black text-[#f4d03f] h-14 font-bold uppercase tracking-widest hover:bg-gray-900 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Processing..." : (
                <>
                  <Lock size={16} /> Secure Checkout
                </>
              )}
            </button>
            
            <p className="text-[10px] text-center mt-4 opacity-40 uppercase tracking-widest flex items-center justify-center gap-1">
              <Lock size={10} /> Secured by Razorpay
            </p>
          </div>
        )}
      </div>
    </>
  );
}