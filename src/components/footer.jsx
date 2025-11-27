import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaPinterest } from "react-icons/fa";

export default function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #111, #222)",
        color: "#fff",
        padding: "40px 60px",
        marginTop: "60px",
        borderTop: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {/* TOP SECTION */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "40px",
        }}
      >
        {/* Brand */}
        <div style={{ maxWidth: "280px" }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "28px",
              color: "#ffcc70",
              marginBottom: "15px",
            }}
          >
            ArtLoom
          </h2>
          <p style={{ lineHeight: "1.6", color: "rgba(255,255,255,0.75)" }}>
            Bringing stunning art and creativity to your walls. Explore premium
            hand-crafted paintings created with passion.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3
            style={{
              fontSize: "18px",
              marginBottom: "12px",
              color: "#ffcc70",
            }}
          >
            Quick Links
          </h3>
          <ul style={{ listStyle: "none", padding: 0, lineHeight: "2" }}>
            <li><Link style={linkStyle} to="/">Home</Link></li>
            <li><Link style={linkStyle} to="/Gallery">Gallery</Link></li>
            <li><Link style={linkStyle} to="/About">About</Link></li>
            <li><Link style={linkStyle} to="/Contact">Contact</Link></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3
            style={{
              fontSize: "18px",
              marginBottom: "12px",
              color: "#ffcc70",
            }}
          >
            Support
          </h3>
          <ul style={{ listStyle: "none", padding: 0, lineHeight: "2" }}>
            <li><Link style={linkStyle} to="/Shipping">Shipping Info</Link></li>
            <li><Link style={linkStyle} to="/Refund">Refund Policy</Link></li>
            <li><Link style={linkStyle} to="/Privacy">Privacy Policy</Link></li>
            <li><Link style={linkStyle} to="/Terms">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3
            style={{
              fontSize: "18px",
              marginBottom: "12px",
              color: "#ffcc70",
            }}
          >
            Follow Us
          </h3>
          <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
            <FaFacebook size={22} style={iconStyle} />
            <FaInstagram size={22} style={iconStyle} />
            <FaTwitter size={22} style={iconStyle} />
            <FaPinterest size={22} style={iconStyle} />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div
        style={{
          textAlign: "center",
          marginTop: "40px",
          paddingTop: "20px",
          borderTop: "1px solid rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.6)",
        }}
      >
        © {new Date().getFullYear()} <span style={{ color: "#ffcc70" }}>ArtLoom</span>.
        All Rights Reserved.
      </div>
    </footer>
  );
}

const linkStyle = {
  textDecoration: "none",
  color: "rgba(255,255,255,0.85)",
  transition: "0.3s",
};

const iconStyle = {
  cursor: "pointer",
  color: "#fff",
  transition: "0.3s",
};
