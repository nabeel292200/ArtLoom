import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, refreshKey } = useAuth();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (!user) {
      setCart([]);
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
    if (exists) {
      const updated = cart.map((p) =>
        p.id === item.id ? { ...p, qty: p.qty + 1 } : p
      );
      return saveCart(updated);
    }

    const updated = [...cart, { ...item, qty: 1 }];
    saveCart(updated);
  };

  const removeFromCart = (id) => {
    const updated = cart.filter((item) => item.id !== id);
    saveCart(updated);
    toast.error("Item removed successfuly")
  };

  const clearCart = () => {
    saveCart([]);
  };

  const increaseQty = (id) => {
    const updated = cart.map((item) =>
      item.id === id ? { ...item, qty: item.qty + 1 } : item
    );
    saveCart(updated);
  };

  const decreaseQty = (id) => {
    const updated = cart
      .map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty - 1) } : item
      )
      .filter((item) => item.qty > 0);

    saveCart(updated);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQty,
        decreaseQty,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
