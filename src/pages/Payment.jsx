import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaCreditCard, FaMoneyBill, FaMobileAlt } from "react-icons/fa";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();

  const { cartItems, total } = location.state || { cartItems: [], total: 0 };

  const [paymentMethod, setPaymentMethod] = useState("card");

  // -------------------------
  // UPDATED handlePayment()
  // -------------------------
  const handlePayment = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    // Convert cart to order objects
    const newOrders = cartItems.map((item) => ({
      id: "ORD-" + Math.floor(Math.random() * 100000),
      title: item.title,
      image: item.image,
      price: item.price,
      status: "Pending",
    }));

    // Get existing orders
    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];

    // Save updated orders in localStorage
    localStorage.setItem(
      "orders",
      JSON.stringify([...existingOrders, ...newOrders])
    );

    alert("Payment Successful!");

    // Navigate to shipping page
    navigate("/shipping", {
      state: {
        order: cartItems,
        amountPaid: total,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Payment Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Payment Details</h2>

          {/* Select Payment Method */}
          <div className="space-y-3 mb-6">
            <h3 className="text-lg font-semibold">Select Payment Method</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              {/* Card */}
              <button
                onClick={() => setPaymentMethod("card")}
                className={`p-4 border rounded-lg flex flex-col items-center gap-2 
                 ${paymentMethod === "card" ? "border-amber-500 bg-amber-50" : "border-gray-300"}`}
              >
                <FaCreditCard size={30} />
                <span>Card</span>
              </button>

              {/* UPI */}
              <button
                onClick={() => setPaymentMethod("upi")}
                className={`p-4 border rounded-lg flex flex-col items-center gap-2
                 ${paymentMethod === "upi" ? "border-amber-500 bg-amber-50" : "border-gray-300"}`}
              >
                <FaMobileAlt size={30} />
                <span>UPI</span>
              </button>

              {/* COD */}
              <button
                onClick={() => setPaymentMethod("cod")}
                className={`p-4 border rounded-lg flex flex-col items-center gap-2
                 ${paymentMethod === "cod" ? "border-amber-500 bg-amber-50" : "border-gray-300"}`}
              >
                <FaMoneyBill size={30} />
                <span>Cash on Delivery</span>
              </button>
            </div>
          </div>

          {/* CARD FORM */}
          {paymentMethod === "card" && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Card Holder Name"
                className="w-full border p-3 rounded-lg"
              />
              <input
                type="text"
                placeholder="Card Number"
                className="w-full border p-3 rounded-lg"
              />
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-1/2 border p-3 rounded-lg"
                />
                <input
                  type="password"
                  placeholder="CVV"
                  className="w-1/2 border p-3 rounded-lg"
                />
              </div>
            </div>
          )}

          {/* UPI FORM */}
          {paymentMethod === "upi" && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter UPI ID"
                className="w-full border p-3 rounded-lg"
              />
              <p className="text-gray-500 text-sm">Example: username@upi</p>
            </div>
          )}

          {/* COD INFO */}
          {paymentMethod === "cod" && (
            <p className="text-gray-600">
              You will pay the amount upon delivery.
            </p>
          )}

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            className="mt-6 w-full bg-amber-500 text-white py-3 rounded-lg
             hover:bg-amber-600 font-semibold text-lg"
          >
            Pay ${total.toFixed(2)}
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">Order Summary</h3>

          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b pb-3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.author}</p>
                  <p className="text-amber-600 font-bold">${item.price}</p>
                </div>
              </div>
            ))}
          </div>

          <hr className="my-4" />

          <div className="flex justify-between text-gray-700">
            <span>Subtotal</span>
            <span>${(total / 1.1).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Tax (10%)</span>
            <span>${(total - total / 1.1).toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-lg font-bold mt-3">
            <span>Total</span>
            <span className="text-amber-600">${total.toFixed(2)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
