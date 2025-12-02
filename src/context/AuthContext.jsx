import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); 

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("user"));
    if (saved) setUser(saved);
  }, []);

  const login = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    
    setRefreshKey((prev) => prev + 1);
  };

  const logout = () => {
    if (user) {
      localStorage.removeItem(`cart_${user.id}`);
      localStorage.removeItem(`wishlist_${user.id}`);
    }

    localStorage.removeItem("user");
    setUser(null);

    
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshKey }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
