import { useState, useEffect } from "react";
import { FaBoxOpen, FaTrash, FaCheckCircle, FaClock } from "react-icons/fa";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  // Load from localStorage on start
  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(savedOrders);
  }, []);

  // Cancel Order
  const cancelOrder = (id) => {
    const updated = orders.map((order) =>
      order.id === id ? { ...order, status: "Cancelled" } : order
    );
    setOrders(updated);
    localStorage.setItem("orders", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <FaBoxOpen className="text-amber-600" /> Your Orders
        </h1>

        {orders.length === 0 ? (
          <p className="text-gray-500 text-lg">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-5 rounded-xl shadow flex items-center gap-5"
              >
                <img
                  src={order.image}
                  alt={order.title}
                  className="w-24 h-24 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{order.title}</h2>
                  <p className="text-gray-600">Order ID: {order.id}</p>
                  <p className="text-amber-600 font-bold">${order.price}</p>

                  <div className="mt-2 flex items-center gap-2">
                    {order.status === "Delivered" && (
                      <>
                        <FaCheckCircle className="text-green-600" />
                        <span className="text-green-600 font-semibold">
                          Delivered
                        </span>
                      </>
                    )}

                    {order.status === "Pending" && (
                      <>
                        <FaClock className="text-yellow-600" />
                        <span className="text-yellow-600 font-semibold">
                          Pending
                        </span>
                      </>
                    )}

                    {order.status === "Cancelled" && (
                      <span className="text-red-600 font-semibold">
                        Cancelled
                      </span>
                    )}
                  </div>
                </div>

                {order.status === "Pending" ? (
                  <button
                    onClick={() => cancelOrder(order.id)}
                    className="bg-red-500 text-white py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-red-600 transition"
                  >
                    <FaTrash /> Cancel
                  </button>
                ) : (
                  <button
                    disabled
                    className="bg-gray-300 text-gray-600 py-2 px-4 rounded-lg cursor-not-allowed"
                  >
                    Cancel
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
