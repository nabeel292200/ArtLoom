import { Routes, Route, useLocation } from "react-router-dom";

// Components
import Header from "./components/Header";

// User Pages
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

// Admin Pages
import AdminDashboard from "./admin/admindashboard";
import AdminOrders from "./admin/adminorders";
import AdminProducts from "./admin/adminproducts";
import AdminUsers from "./admin/adminusers";
import AdminSidebar from "./admin/adminsidebar";
import PrivateAdmin from "./admin/privateadmin";

// Toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const location = useLocation();

  // Hide header on login, register, admin routes
  const hideHeaderRoutes = ["/login", "/register"];
  const isAdminRoute = location.pathname.startsWith("/admin");
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname) || isAdminRoute;

  return (
    <div>
      {/* Header only for user pages */}
      {!shouldHideHeader && <Header />}

      <ToastContainer position="top-right" autoClose={2000} />

      <Routes>
        {/* USER ROUTES */}
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
        <Route
          path="/admin"
          element={
            <PrivateAdmin>
              <div className="flex">
                <AdminSidebar />
                <div className="flex-1 p-6">
                  <AdminDashboard />
                </div>
              </div>
            </PrivateAdmin>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <PrivateAdmin>
              <div className="flex">
                <AdminSidebar />
                <div className="flex-1 p-6">
                  <AdminOrders />
                </div>
              </div>
            </PrivateAdmin>
          }
        />

        <Route
          path="/admin/products"
          element={
            <PrivateAdmin>
              <div className="flex">
                <AdminSidebar />
                <div className="flex-1 p-6">
                  <AdminProducts />
                </div>
              </div>
            </PrivateAdmin>
          }
        />

        <Route
          path="/admin/users"
          element={
            <PrivateAdmin>
              <div className="flex">
                <AdminSidebar />
                <div className="flex-1 p-6">
                  <AdminUsers />
                </div>
              </div>
            </PrivateAdmin>
          }
        />
      </Routes>
    </div>
  );
}
