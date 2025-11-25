// import { Link } from "react-router-dom";

// export default function Header() {

//   return (
//     <header
//       style={{
//         padding: " 0px",
//         background: "linear-gradient(135deg, #111, #333)",
//         color: "#fff",
//         backdropFilter: "blur(8px)",
//         borderBottom: "1px solid rgba(255,255,255,0.1)",
//       }}
//     >
//       <h2
//         style={{
//           textAlign: "center",
//           fontFamily: "'Playfair Display', serif",
//           fontSize: "32px",
//           letterSpacing: "2px",
//           color: "#ffcc70",
//           margin: "0",
//           textShadow: "0px 0px 8px rgba(255,204,112,0.4)",
//         }}
//       >
//         ArtLoom
//       </h2>

//       <nav
//         style={{
//           display: "flex",
//           gap: "25px",
//           justifyContent: "center",
//           marginTop: "12px",
          
//         }}
//       >
//         {["/", "/Gallery", "/About", "/Contact"].map((path, i) => {
//           const text = ["HOME", "GALLERY", "ABOUT", "CONTACT"][i];
//           return (
//             <Link
//               key={text}
//               to={path}
//               style={{
//                 color: "#fff",
//                 textDecoration: "none",
//                 fontSize: "15px",
//                 fontWeight: "500",
//                 letterSpacing: "1px",
//                 padding: "6px 14px",
//                 borderRadius: "20px",
//                 transition: "0.3s",
//               }}
//               onMouseEnter={(e) => {
//                 e.target.style.background = "#ffcc70";
//                 e.target.style.color = "#000";
//               }}
//               onMouseLeave={(e) => {
//                 e.target.style.background = "transparent";
//                 e.target.style.color = "#fff";
//               }}
//             >
//               {text}
//             </Link>
//           );
//         })}
//       </nav>
//     </header>
//   );
// }



import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaTruck, FaUser } from "react-icons/fa";

export default function Header() {
  const navigate = useNavigate(); // <-- added here

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
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "30px",
          letterSpacing: "2px",
          color: "#ffcc70",
          margin: "0",
          textShadow: "0px 0px 8px rgba(255,204,112,0.4)",
        }}
      >
        ArtLoom
      </h2>

      {/* Navigation */}
      <nav style={{ display: "flex", gap: "25px" }}>
        {["/", "/Gallery", "/About", "/Contact"].map((path, i) => {
          const text = ["HOME", "GALLERY", "ABOUT", "CONTACT"][i];
          return (
            <Link
              key={text}
              to={path}
              style={{
                color: "#fff",
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
                e.target.style.background = "transparent";
                e.target.style.color = "#fff";
              }}
            >
              {text}
            </Link>
          );
        })}
      </nav>

      {/* Icons Section */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {/* Click navigation added here */}
        <FaHeart
          size={20}
          style={{ cursor: "pointer" }}
          title="Wishlist"
          onClick={() => navigate("/Wishlist")}
        />

        <FaShoppingCart
          size={20}
          style={{ cursor: "pointer" }}
          title="Cart"
          onClick={() => navigate("/Cart")}
        />

        <FaTruck
          size={20}
          style={{ cursor: "pointer" }}
          title="Shipping"
          onClick={() => navigate("/Shipping")}
        />

        {/* Login Button */}
        <button
          onClick={() => navigate("/login")} // navigate on click
          style={{
            padding: "6px 16px",
            background: "#ffcc70",
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
            e.target.style.background = "#ffcc70";
            e.target.style.color = "#000";
          }}
        >
          <FaUser size={16} /> Login
        </button>
      </div>
    </header>
  );
}
