import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaTruck, FaUser } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useWishlist } from "../context/WishlistContext"; // ✅ wishlist context
import { useCart } from "../context/CartContext"; // ✅ cart context

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const { wishlist } = useWishlist(); 
  const { cart } = useCart(); 

  const [activePath, setActivePath] = useState(location.pathname);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    setActivePath(location.pathname);


    const user = JSON.parse(localStorage.getItem("user"));
    setLoggedIn(!!user);
    setLoggedInUser(user);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLoggedIn(false);
    setLoggedInUser(null);
    navigate("/login");
  };

  const navLinks = [
    { path: "/", text: "HOME" },
    { path: "/Gallery", text: "GALLERY" },
    { path: "/About", text: "ABOUT" },
    { path: "/Contact", text: "CONTACT" },
  ];

  const iconButtons = [
    {
      icon: (
        <div style={{ position: "relative" }}>
          <FaHeart size={20} />
          {wishlist.length > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-8px",
                right: "-10px",
                background: "red",
                color: "#fff",
                fontSize: "12px",
                padding: "2px 6px",
                borderRadius: "50%",
                fontWeight: "bold",
              }}
            >
              {wishlist.length}
            </span>
          )}
        </div>
      ),
      path: "/Wishlist",
      title: "Wishlist",
    },
    {
      icon: (
        <div style={{ position: "relative" }}>
          <FaShoppingCart size={20} />
          {cart.length > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-8px",
                right: "-10px",
                background: "red",
                color: "#fff",
                fontSize: "12px",
                padding: "2px 6px",
                borderRadius: "50%",
                fontWeight: "bold",
              }}
            >
              {cart.length}
            </span>
          )}
        </div>
      ),
      path: "/Cart",
      title: "Cart",
    },
    { icon: <FaTruck size={20} />, path: "/Shipping", title: "Shipping" },
  ];

  const isActive = (path) => activePath === path;

  return (
    <header
      style={{
        padding: "10px 0",
        background: "linear-gradient(135deg, #111, #333)",
        color: "#fff",
        borderBottom: "1px solid rgba(255,255,255,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingInline: "40px",
        position: "sticky",
        top: "0",
        zIndex: "999",
      }}
    >
      {/* Logo */}
      <h2
        onClick={() => {
          navigate("/");
          setActivePath("/");
        }}
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "30px",
          letterSpacing: "2px",
          color: "#ffcc70",
          margin: "0",
          cursor: "pointer",
          transition: "0.3s",
        }}
      >
        ArtLoom
      </h2>

      {/* Navigation */}
      <nav style={{ display: "flex", gap: "25px" }}>
        {navLinks.map(({ path, text }) => (
          <Link
            key={text}
            to={path}
            onClick={() => setActivePath(path)}
            style={{
              color: isActive(path) ? "#000" : "#fff",
              background: isActive(path) ? "#ffcc70" : "transparent",
              textDecoration: "none",
              fontSize: "15px",
              padding: "6px 14px",
              borderRadius: "20px",
              transition: "0.3s",
            }}
          >
            {text}
          </Link>
        ))}
      </nav>

      {/* Right Section */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {/* Icons */}
        {iconButtons.map(({ icon, path, title }) => (
          <div
            key={title}
            onClick={() => {
              navigate(path);
              setActivePath(path);
            }}
            style={{
              cursor: "pointer",
              color: isActive(path) ? "#ffcc70" : "#fff",
              transition: "0.3s",
            }}
          >
            {icon}
          </div>
        ))}

        {/* Greeting + Logout */}
        {loggedIn ? (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                fontWeight: "600",
                fontSize: "15px",
                color: "#ffcc70",
              }}
            >
              Hi, {loggedInUser?.name}
            </span>

            <button
              onClick={handleLogout}
              style={{
                padding: "6px 16px",
                background: "red",
                border: "none",
                borderRadius: "18px",
                color: "#fff",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              navigate("/login");
              setActivePath("/login");
            }}
            style={{
              padding: "6px 16px",
              background: isActive("/login") ? "#fff" : "#ffcc70",
              border: "none",
              borderRadius: "18px",
              color: "#000",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              transition: "0.3s",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#fff";
              e.target.style.color = "#000";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = isActive("/login") ? "#fff" : "#ffcc70";
            }}
          >
            <FaUser size={16} /> Login
          </button>
        )}
      </div>
    </header>
  );
}
