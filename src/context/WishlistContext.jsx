import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user, refreshKey } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  // LOAD WISHLIST ON LOGIN / REFRESH
  useEffect(() => {
    if (!user) {
      setWishlist([]);
      return;
    }

    const saved = JSON.parse(localStorage.getItem(`wishlist_${user.id}`)) || [];
    setWishlist(saved);
  }, [user, refreshKey]);

  // ADD ITEM
  const addToWishlist = (item) => {
    if (!user) return alert("Please login first");

    const exists = wishlist.some((x) => x.id === item.id);
    if (exists) return; // avoid duplicates

    const updated = [...wishlist, item];
    setWishlist(updated);
    localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updated));
  };

  // REMOVE ITEM
  const removeFromWishlist = (id) => {
    const updated = wishlist.filter((item) => item.id !== id);
    setWishlist(updated);
    localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updated));
  };

  // CHECK ITEM EXISTS
  const isInWishlist = (id) => {
    return wishlist.some((item) => item.id === id);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
