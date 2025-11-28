import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const Shipping = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:3001/orders?email=${user.email}`
        );
        if (!res.ok) throw new Error("Failed to load orders");

        const ordersData = await res.json();

        // Normalize old orders to have items array
        const ordersWithItems = ordersData.map((order) => {
          const items = order.items?.length
            ? order.items
            : [
                {
                  id: order.id,
                  title: order.title,
                  image: order.image,
                  price: order.price,
                  qty: order.qty || 1,
                },
              ];
          return { ...order, items };
        });

        setOrders(ordersWithItems.reverse());
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleCancelOrder = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const orderRes = await fetch(`http://localhost:3001/orders/${id}`);
      const orderData = await orderRes.json();

      // Restore stock
      const items = orderData.items?.length
        ? orderData.items
        : [
            {
              id: orderData.id,
              qty: orderData.qty || 1,
            },
          ];

      for (const item of items) {
        const productRes = await fetch(`http://localhost:3001/products/${item.id}`);
        const product = await productRes.json();
        const updatedStock = (Number(product.stock) || 0) + (Number(item.qty) || 1);

        await fetch(`http://localhost:3001/products/${item.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stock: updatedStock }),
        });
      }

      // Update order status
      await fetch(`http://localhost:3001/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled" }),
      });

      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: "Cancelled" } : order
        )
      );

      alert("Order cancelled & stock restored.");
    } catch (err) {
      console.error(err);
      alert("Failed to cancel order.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Processing":
        return "bg-yellow-100 text-yellow-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-10 px-6">
        <h2 className="text-3xl font-bold text-center text-orange-700 mb-10">
          My Orders
        </h2>

        {loading ? (
          <div className="max-w-4xl mx-auto space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-200 rounded-2xl h-32 w-full"
              ></div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center mt-10">
            <p className="text-lg text-gray-600 mb-4">
              You have not placed any orders yet.
            </p>
            <button
              onClick={() => navigate("/Products")}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-8">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border shadow-lg rounded-2xl p-6"
              >
                {/* HEADER */}
                <div className="flex justify-between border-b pb-4 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Order ID:
                      <span className="text-orange-600 font-bold">
                        {" "}
                        {order.orderId || order.id}
                      </span>
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Placed on:{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* ITEMS */}
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between gap-4 border-b pb-3"
                    >
                      <img
                        src={item.image}
                        className="w-20 h-20 rounded object-cover border"
                        alt={item.title}
                      />

                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{item.title}</p>
                        <p className="text-gray-500 text-xs">
                          Category: {item.category || "N/A"}
                        </p>
                        <p className="text-gray-500 text-xs">
                          Stock Now: {item.stock ?? "N/A"}
                        </p>
                        <p className="text-gray-700 text-sm">Qty: {item.qty}</p>
                      </div>

                      <span className="font-semibold text-gray-900">
                        ₹{(item.price || 0) * (item.qty || 1)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* TOTAL */}
                <div className="mt-4 flex justify-between border-t pt-3 text-gray-800 font-semibold">
                  <span>Total Amount</span>
                  <span>
                    ₹
                    {order.items.reduce(
                      (acc, item) => acc + (Number(item.price) || 0) * (Number(item.qty) || 1),
                      0
                    )}
                  </span>
                </div>

                {/* CANCEL BUTTON */}
                <div className="mt-6 flex justify-end">
                  {order.status !== "Cancelled" &&
                    order.status !== "Delivered" && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
                      >
                        Cancel Order
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Shipping;
