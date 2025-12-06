import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit2, 
  Lock, 
  ShoppingBag, 
  Heart, 
  ShoppingCart, 
  LogOut,
  X,
  Check,
  Eye,
  EyeOff
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext"; 

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const { cart } = useCart();
  const { wishlist } = useWishlist();

  // Load saved user from localStorage (and ensure id exists)
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser) {
      navigate("/login");
      return;
    }
    if (!savedUser.id) {
      // If no id present, redirect to login to ensure proper login flow
      console.warn("Local user does not have id. Redirecting to login.");
      navigate("/login");
      return;
    }
    setUser(savedUser);
    setEditForm(prev => ({
      ...prev,
      name: savedUser.name || "",
      phone: savedUser.phone || "",
      address: savedUser.address || ""
    }));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // Generic patch helper
  const patchUser = async (patchBody) => {
    if (!user?.id) throw new Error("User id missing");
    const res = await fetch(`http://localhost:3001/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patchBody)
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Patch failed: ${res.status} ${text}`);
    }
    const updated = await res.json();
    // Merge into local user object (json-server returns updated resource)
    const merged = { ...user, ...patchBody, ...updated };
    localStorage.setItem("user", JSON.stringify(merged));
    setUser(merged);
    return merged;
  };

  // Save Name
  const handleSaveName = async () => {
    if (!editForm.name.trim()) return;
    setLoading(true);
    try {
      await patchUser({ name: editForm.name });
      setIsEditingName(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update name. See console for details.");
    }
    setLoading(false);
  };

  // Save Phone
  const handleSavePhone = async () => {
    const newPhone = editForm.phone?.trim() || "";
    setLoading(true);
    try {
      await patchUser({ phone: newPhone });
      setIsEditingPhone(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update phone.");
    }
    setLoading(false);
  };

  // Save Address
  const handleSaveAddress = async () => {
    const newAddress = editForm.address?.trim() || "";
    setLoading(true);
    try {
      await patchUser({ address: newAddress });
      setIsEditingAddress(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update address.");
    }
    setLoading(false);
  };

  // Save Password
  const handleSavePassword = async () => {
    if (!editForm.newPassword || editForm.newPassword !== editForm.confirmPassword) {
      alert("Passwords don't match or are empty");
      return;
    }
    setLoading(true);
    try {
      // 1. Fetch current user from DB to validate current password
      const resp = await fetch(`http://localhost:3001/users/${user.id}`);
      if (!resp.ok) throw new Error("Failed to fetch user from DB");
      const userData = await resp.json();

      // 2. Validate current password
      if (userData.password !== editForm.currentPassword) {
        alert("Current password is incorrect!");
        setLoading(false);
        return;
      }

      // 3. Patch new password
      await patchUser({ password: editForm.newPassword });

      // 4. Reset UI
      setIsEditingPassword(false);
      setEditForm(prev => ({ 
        ...prev, 
        currentPassword: "", 
        newPassword: "", 
        confirmPassword: "" 
      }));
      alert("Password updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating password. See console for details.");
    }
    setLoading(false);
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  if (!user) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading profile...</p>
      </div>
    </div>
  );

  const orderCount = localStorage.getItem("orderCount") || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            My Profile
          </h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200 hover:scale-105"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-4xl md:text-5xl font-bold">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg">
                    <Edit2 size={20} className="text-blue-600" />
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {isEditingName ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                          className="flex-1 px-4 py-2 border-2 border-blue-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                          autoFocus
                        />
                        <button
                          onClick={handleSaveName}
                          disabled={loading}
                          className="p-2 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50"
                        >
                          <Check size={20} />
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingName(false);
                            setEditForm(prev => ({ ...prev, name: user.name }));
                          }}
                          className="p-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{user.name}</h2>
                        <button
                          onClick={() => setIsEditingName(true)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <Edit2 size={18} className="text-gray-600" />
                        </button>
                      </>
                    )}
                  </div>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Mail size={16} />
                    {user.email}
                  </p>
                  <p className="text-gray-600 flex items-center gap-2 mt-1">
                    <User size={16} />
                    Member since {new Date(user.joinedDate || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <User size={24} />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  {/* Email (read-only) */}
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-50 rounded-xl">
                      <Mail className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  
                  {/* Phone (editable) */}
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-50 rounded-xl">
                      <Phone className="text-green-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Phone</p>

                      {isEditingPhone ? (
                        <div className="flex gap-2 items-center mt-1">
                          <input
                            type="text"
                            value={editForm.phone}
                            onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            autoFocus
                          />
                          <button
                            onClick={handleSavePhone}
                            disabled={loading}
                            className="p-2 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setIsEditingPhone(false);
                              setEditForm(prev => ({ ...prev, phone: user.phone || "" }));
                            }}
                            className="p-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <div className="mt-1 flex items-center gap-3">
                          <p className="font-medium">{user.phone || "Not added"}</p>
                          <button
                            onClick={() => setIsEditingPhone(true)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <Edit2 size={16} className="text-gray-600" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {/* Address (editable) */}
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-50 rounded-xl">
                      <MapPin className="text-purple-600" size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">Address</p>

                      {isEditingAddress ? (
                        <div className="flex gap-2 items-center mt-1">
                          <input
                            type="text"
                            value={editForm.address}
                            onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                            className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            autoFocus
                          />
                          <button
                            onClick={handleSaveAddress}
                            disabled={loading}
                            className="p-2 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setIsEditingAddress(false);
                              setEditForm(prev => ({ ...prev, address: user.address || "" }));
                            }}
                            className="p-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <div className="mt-1 flex items-center gap-3">
                          <p className="font-medium">{user.address || "Not added"}</p>
                          <button
                            onClick={() => setIsEditingAddress(true)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <Edit2 size={16} className="text-gray-600" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Password Update Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Lock size={24} />
                  Security
                </h3>
                {!isEditingPassword && (
                  <button
                    onClick={() => setIsEditingPassword(true)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                  >
                    Change Password
                  </button>
                )}
              </div>

              {isEditingPassword && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type={showPassword.current ? "text" : "password"}
                      value={editForm.currentPassword}
                      onChange={(e) => setEditForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("current")}
                      className="absolute right-3 top-10 text-gray-500"
                    >
                      {showPassword.current ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type={showPassword.new ? "text" : "password"}
                      value={editForm.newPassword}
                      onChange={(e) => setEditForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("new")}
                      className="absolute right-3 top-10 text-gray-500"
                    >
                      {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type={showPassword.confirm ? "text" : "password"}
                      value={editForm.confirmPassword}
                      onChange={(e) => setEditForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("confirm")}
                      className="absolute right-3 top-10 text-gray-500"
                    >
                      {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleSavePassword}
                      disabled={loading}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-green-700 disabled:opacity-50 transition-all duration-200"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Updating...
                        </span>
                      ) : "Update Password"}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingPassword(false);
                        setEditForm(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
                      }}
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-6">Account Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <span>Orders</span>
                  <span className="font-bold text-lg">{orderCount}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <span>Wishlist Items</span>
                  <span className="font-bold text-lg">{wishlist.length}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                  <span>Cart Items</span>
                  <span className="font-bold text-lg">{cart.length}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/orders")}
                  className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-all duration-200 hover:translate-x-1"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag size={20} />
                    <span className="font-medium">My Orders</span>
                  </div>
                  <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                    {orderCount}
                  </div>
                </button>

                <button
                  onClick={() => navigate("/wishlist")}
                  className="w-full flex items-center justify-between p-4 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-xl transition-all duration-200 hover:translate-x-1"
                >
                  <div className="flex items-center gap-3">
                    <Heart size={20} />
                    <span className="font-medium">My Wishlist</span>
                  </div>
                  <div className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium">
                    {wishlist.length}
                  </div>
                </button>

                <button
                  onClick={() => navigate("/cart")}
                  className="w-full flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-xl transition-all duration-200 hover:translate-x-1"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart size={20} />
                    <span className="font-medium">My Cart</span>
                  </div>
                  <div className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                    {cart.length}
                  </div>
                </button>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Settings</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  Notification Preferences
                </button>
                <button className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  Privacy Settings
                </button>
                <button className="w-full text-left p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  Billing Information
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
