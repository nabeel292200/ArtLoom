// CartContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, refreshKey } = useAuth();
  const [cart, setCart] = useState([]);

  // Load cart when user logs in OR refreshKey changes
  useEffect(() => {
    if (!user) {
      setCart([]); // logout → clear instantly
      return;
    }

    const saved = JSON.parse(localStorage.getItem(`cart_${user.id}`)) || [];
    setCart(saved);
  }, [user, refreshKey]);

  const saveCart = (updatedCart) => {
    if (!user) return;
    setCart(updatedCart);
    localStorage.setItem(`cart_${user.id}`, JSON.stringify(updatedCart));
  };

  const addToCart = (item) => {
    if (!user) return alert("Please login first");

    const exists = cart.find((p) => p.id === item.id);
    if (exists) return alert("Already in cart");

    const updated = [...cart, item];
    saveCart(updated);
  };

  const removeFromCart = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
