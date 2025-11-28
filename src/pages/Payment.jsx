import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaCreditCard, FaMoneyBill, FaMobileAlt, FaLock } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const savedUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = savedUser?.id;

  const { cartItems, total } = location.state || { cartItems: [], total: 0 };
  const { clearCart } = useCart();

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    upiId: "",
    cardName: ""
  });

  const handlePayment = async () => {
    if (!currentUserId) {
      toast.error("You must be logged in to continue!");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    // Simple validation
    if (paymentMethod === "card") {
      if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardName) {
        toast.error("Please fill all card details");
        return;
      }
    }

    if (paymentMethod === "upi") {
      if (!formData.upiId) {
        toast.error("Please enter UPI ID");
        return;
      }
    }

    setLoading(true);

    try {
      const userRes = await fetch(`http://localhost:3001/users/${currentUserId}`);
      const user = await userRes.json();

      if (!user || !user.email) {
        toast.error("User email not found!");
        setLoading(false);
        return;
      }

      // Create order
      const order = {
        userId: currentUserId,
        user: user.name,
        email: user.email,
        items: cartItems.map(item => ({
          id: item.id,
          title: item.title,
          image: item.image,
          price: item.price,
          qty: item.qty || 1
        })),
        status: "Pending",
        paymentMethod: paymentMethod,
        createdAt: new Date().toISOString()
      };

      // Save the order
      const saveOrder = await fetch("http://localhost:3001/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
      });

      if (!saveOrder.ok) throw new Error("Failed to save order");

      // Reduce stock for each product
      for (let item of cartItems) {
        const prodRes = await fetch(`http://localhost:3001/products/${item.id}`);
        const product = await prodRes.json();

        const newStock = (product.stock || 0) - (item.qty || 1);

        await fetch(`http://localhost:3001/products/${item.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stock: newStock })
        });
      }

      clearCart();
      toast.success("🎉 Payment successful!");
      navigate("/shipping");

    } catch (error) {
      console.error(error);
      toast.error("Payment failed! Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Payment</h1>
          <p className="text-gray-600">Choose how you want to pay</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          {/* Payment Methods */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button
                onClick={() => setPaymentMethod("card")}
                className={`p-3 border rounded-lg flex flex-col items-center gap-2 ${
                  paymentMethod === "card" ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
              >
                <FaCreditCard className="text-blue-500" size={20} />
                <span className="text-sm font-medium">Card</span>
              </button>

              <button
                onClick={() => setPaymentMethod("upi")}
                className={`p-3 border rounded-lg flex flex-col items-center gap-2 ${
                  paymentMethod === "upi" ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
              >
                <FaMobileAlt className="text-green-500" size={20} />
                <span className="text-sm font-medium">UPI</span>
              </button>

              <button
                onClick={() => setPaymentMethod("cod")}
                className={`p-3 border rounded-lg flex flex-col items-center gap-2 ${
                  paymentMethod === "cod" ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
              >
                <FaMoneyBill className="text-orange-500" size={20} />
                <span className="text-sm font-medium">COD</span>
              </button>
            </div>

            {/* Payment Forms */}
            {paymentMethod === "card" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    value={formData.cardName}
                    onChange={(e) => handleInputChange("cardName", e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={formData.expiryDate}
                      onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="text"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange("cvv", e.target.value)}
                      placeholder="123"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "upi" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
                <input
                  type="text"
                  value={formData.upiId}
                  onChange={(e) => handleInputChange("upiId", e.target.value)}
                  placeholder="yourname@upi"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">Enter your UPI ID (e.g., name@okicici, name@paytm)</p>
              </div>
            )}

            {paymentMethod === "cod" && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  💰 Pay cash when your order is delivered. Exact change is appreciated.
                </p>
              </div>
            )}
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
          >
            <FaLock size={16} />
            {loading ? "Processing..." : `Pay $${total.toFixed(2)}`}
          </button>

          <p className="text-center text-sm text-gray-500 mt-3 flex items-center justify-center gap-1">
            <FaLock size={12} />
            Your payment is secure and encrypted
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          
          <div className="space-y-3 mb-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt={item.title} className="w-10 h-10 rounded object-cover" />
                  <span className="font-medium">{item.title}</span>
                </div>
                <span className="text-gray-600">${item.price} x {item.qty || 1}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total</span>
              <span className="text-blue-600">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}