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

  // Address state
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: ""
  });

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

    
    if (
      !address.fullName ||
      !address.phone ||
      !address.street ||
      !address.city ||
      !address.state ||
      !address.pincode
    ) {
      toast.error("Please fill all address fields!");
      return;
    }

    
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

      
      const order = {
        userId: currentUserId,
        user: user.name,
        email: user.email,
        address: address, 
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

      
      const saveOrder = await fetch("http://localhost:3001/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order)
      });

      if (!saveOrder.ok) throw new Error("Failed to save order");

      
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

        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Payment</h1>
          <p className="text-gray-600">Choose how you want to pay</p>
        </div>

        
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Delivery Address</h3>

          <div className="space-y-4">
            <input type="text" placeholder="Full Name"
              className="w-full p-2 border rounded"
              value={address.fullName}
              onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
            />

            <input type="text" placeholder="Phone Number"
              className="w-full p-2 border rounded"
              value={address.phone}
              onChange={(e) => setAddress({ ...address, phone: e.target.value })}
            />

            <input type="text" placeholder="Street Address"
              className="w-full p-2 border rounded"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="City"
                className="p-2 border rounded"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
              />
              <input type="text" placeholder="State"
                className="p-2 border rounded"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
              />
            </div>

            <input type="text" placeholder="Pincode"
              className="w-full p-2 border rounded"
              value={address.pincode}
              onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
            />
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Payment Method</h3>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <button
                onClick={() => setPaymentMethod("card")}
                className={`p-3 border rounded-lg flex flex-col items-center ${
                  paymentMethod === "card" ? "border-blue-500 bg-blue-50" : ""
                }`}
              >
                <FaCreditCard size={20} />
                Card
              </button>

              <button
                onClick={() => setPaymentMethod("upi")}
                className={`p-3 border rounded-lg flex flex-col items-center ${
                  paymentMethod === "upi" ? "border-blue-500 bg-blue-50" : ""
                }`}
              >
                <FaMobileAlt size={20} />
                UPI
              </button>

              <button
                onClick={() => setPaymentMethod("cod")}
                className={`p-3 border rounded-lg flex flex-col items-center ${
                  paymentMethod === "cod" ? "border-blue-500 bg-blue-50" : ""
                }`}
              >
                <FaMoneyBill size={20} />
                COD
              </button>
            </div>

            {/* Card */}
            {paymentMethod === "card" && (
              <div className="space-y-3">
                <input type="text" placeholder="Cardholder Name"
                  className="w-full p-2 border rounded"
                  value={formData.cardName}
                  onChange={(e) => handleInputChange("cardName", e.target.value)}
                />

                <input type="text" placeholder="Card Number"
                  className="w-full p-2 border rounded"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                />

                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="MM/YY"
                    className="p-2 border rounded"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                  />

                  <input type="text" placeholder="CVV"
                    className="p-2 border rounded"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange("cvv", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* UPI */}
            {paymentMethod === "upi" && (
              <input type="text" placeholder="yourname@upi"
                className="w-full p-2 border rounded"
                value={formData.upiId}
                onChange={(e) => handleInputChange("upiId", e.target.value)}
              />
            )}

            {/* COD */}
            {paymentMethod === "cod" && (
              <div className="bg-yellow-50 border p-3 rounded">
                Pay when order arrives.
              </div>
            )}
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg"
          >
            <FaLock className="inline mr-2" />
            {loading ? "Processing..." : `Pay $${total.toFixed(2)}`}
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

          <div className="space-y-3 mb-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex justify-between">
                <div className="flex gap-3">
                  <img src={item.image} className="w-10 h-10 rounded" />
                  <span>{item.title}</span>
                </div>
                <span>${item.price} x {item.qty}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-blue-600">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
