import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Products from "./components/ProductCard"; // ✅ Corrected import
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Shipping from "./pages/Shipping";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetail from "./pages/productdetails";
import Payment from "./pages/Payment";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <div>
      <Header />

      {/* Toast notifications */}
      <ToastContainer position="top-right" autoClose={2000} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Gallery" element={<Gallery />} />
        <Route path="/About" element={<About />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/products" element={<Products />} /> {/* Products page */}
        <Route path="/ProductDetail/:id" element={<ProductDetail />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/Shipping" element={<Shipping />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </div>
  );
}
