import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaTruck, FaUser } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  // Track active path for instant update
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    setActivePath(location.pathname); // sync with route changes
  }, [location.pathname]);

  const navLinks = [
    { path: "/", text: "HOME" },
    { path: "/Gallery", text: "GALLERY" },
    { path: "/About", text: "ABOUT" },
    { path: "/Contact", text: "CONTACT" },
  ];

  const iconButtons = [
    { icon: <FaHeart size={20} />, path: "/Wishlist", title: "Wishlist" },
    { icon: <FaShoppingCart size={20} />, path: "/Cart", title: "Cart" },
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
          setActivePath("/"); // instant update
        }}
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "30px",
          letterSpacing: "2px",
          color: "#ffcc70",
          margin: "0",
          textShadow: "0px 0px 8px rgba(255,204,112,0.4)",
          cursor: "pointer",
          transition: "0.3s",
        }}
        onMouseEnter={(e) => (e.target.style.color = "#fff")}
        onMouseLeave={(e) => (e.target.style.color = "#ffcc70")}
      >
        ArtLoom
      </h2>

      {/* Navigation */}
      <nav style={{ display: "flex", gap: "25px" }}>
        {navLinks.map(({ path, text }) => (
          <Link
            key={text}
            to={path}
            onClick={() => setActivePath(path)} // instant update
            style={{
              color: isActive(path) ? "#000" : "#fff",
              background: isActive(path) ? "#ffcc70" : "transparent",
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: "500",
              padding: "6px 14px",
              borderRadius: "20px",
              transition: "0.3s",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#ffcc70";
              e.target.style.color = "#000";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = isActive(path) ? "#ffcc70" : "transparent";
              e.target.style.color = isActive(path) ? "#000" : "#fff";
            }}
          >
            {text}
          </Link>
        ))}
      </nav>

      {/* Icons Section */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {iconButtons.map(({ icon, path, title }) => (
          <div
            key={title}
            title={title}
            onClick={() => {
              navigate(path);
              setActivePath(path); // instant update
            }}
            style={{
              cursor: "pointer",
              color: isActive(path) ? "#ffcc70" : "#fff",
              transition: "0.3s",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#ffcc70")}
            onMouseLeave={(e) => (e.target.style.color = isActive(path) ? "#ffcc70" : "#fff")}
          >
            {icon}
          </div>
        ))}

        {/* Login Button */}
        <button
          onClick={() => {
            navigate("/login");
            setActivePath("/login"); // instant update
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
      </div>
    </header>
  );
}
