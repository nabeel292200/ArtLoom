import { Routes, Route, useLocation } from "react-router-dom";

// Components
import Header from "./components/Header";

// Pages
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Products from "./pages/Gallery";    
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Shipping from "./pages/Shipping";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/productdetails";
import Payment from "./pages/Payment";
import profile from "./pages/profile";

// Toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfilePage from "./pages/profile";

export default function App() {
  const location = useLocation();

  // Remove header on login & register pages
  const hideHeaderRoutes = ["/login", "/Register"];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <div>
      {/* Header only on allowed pages */}
      {!shouldHideHeader && <Header />}

      <ToastContainer position="top-right" autoClose={2000} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Gallery" element={<Gallery />} />
        <Route path="/About" element={<About />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/products" element={<Products />} />   
        <Route path="/ProductDetail/:id" element={<ProductDetail />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/payment" element={<Payment />} />
          <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}
