// export default function Home() {
//   return (
//     <div style={{backgroundImage:"https://img.freepik.com/free-photo/woman-tradition…29be1668837350f1098f8c661cfda8db40b1e17dc7&w=2000"}}>
//       <h1>Welcome to ArtLoom</h1>
//       <p>Choose your favorite Art</p>
//     </div>
//   );
// }

// 

import { useNavigate } from "react-router-dom";
import bgImg from "../assets/bg-img.jpg";

export default function Home() {
  const navigate = useNavigate();

  const goToGallery = () => {
    navigate("/Gallery");
  };

  return (
    <div
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        textShadow: "0 0 10px rgba(0,0,0,0.7)",
        fontFamily: "'Playfair Display', serif",
      }}
    >
      <h1 style={{ fontSize: "48px", margin: 0 }}>Welcome to ArtLoom</h1>
      <p style={{ fontSize: "20px", marginTop: "10px" }}>
        Choose Your Favorite Art 🎨
      </p>

      <button
        onClick={goToGallery}
        className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl mt-5"
      >
        Gallery
      </button>
    </div>
  );
}
