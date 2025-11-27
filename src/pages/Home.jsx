import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";
import bgImg from "../assets/bg-img.jpg";

export default function Home() {
  const navigate = useNavigate();

  const goToGallery = () => {
    navigate("/Gallery");
  };

  return (
    <>
      {/* Fullscreen Hero Section */}
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

      {/* Footer Always Bottom */}
      <Footer />
    </>
  );
}
