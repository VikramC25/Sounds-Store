import { createContext, useState, useContext, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  // Load cart from localStorage on start to persist data
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load cart", e);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (pack) => {
    setCartItems((prev) => {
      // Prevent adding the same pack twice
      if (prev.find((item) => item._id === pack._id)) return prev;
      return [...prev, pack];
    });
    setIsCartOpen(true); // Auto-open drawer when adding
  };

  const removeFromCart = (packId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== packId));
  };

  const clearCart = () => setCartItems([]);
  const toggleCart = () => setIsCartOpen(!isCartOpen);

  // Calculate total price
  const cartTotal = cartItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        addToCart,
        removeFromCart,
        clearCart,
        toggleCart,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook for easy access
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};