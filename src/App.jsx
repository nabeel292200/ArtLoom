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
import ProfilePage from "./pages/profile";

// Admin pages
import AdminAddproduct from "./pages/admin/adminAddproduct";
import Admindashbord from "./pages/admin/admindashbord";
import Adminhome from "./pages/admin/adminhome";
import Adminorder from "./pages/admin/adminorder";
import Adminproduct from "./pages/admin/adminproduct";
import Adminuser from "./pages/admin/adminuser";

// Toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const location = useLocation();

  // Hide header for login, register, and admin pages
  const hideHeaderRoutes = [
    "/login",
    "/Register",
    "/admin",
    "/admin/adminhome",
    "/admin/addproduct",
    "/admin/products",
    "/admin/orders",
    "/admin/users"
  ];

  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <div>
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

        {/* ADMIN ROUTES */}
        <Route path="/admin" element={<Admindashbord />} />
        <Route path="adminhome" element={<Adminhome />} />
        <Route path="adminAddproduct" element={<AdminAddproduct />} />
        <Route path="adminproduct" element={<Adminproduct />} />
        <Route path="/admin/orders" element={<Adminorder />} />
        <Route path="/admin/users" element={<Adminuser />} />
      </Routes>
    </div>
  );
}
