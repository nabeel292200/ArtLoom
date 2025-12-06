// src/admin/adminorders.jsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function StatusBadge({ status }) {
  const map = {
    pending: "bg-yellow-100 text-yellow-700",
    shipped: "bg-blue-100 text-blue-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return <span className={`px-2 py-1 rounded ${map[status] || "bg-gray-100 text-gray-700"}`}>{status}</span>;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [changing, setChanging] = useState(null);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/orders");
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders((data || []).slice().sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (e) {
      console.error(e);
      toast.error("Could not load orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchOrders(); }, []);

  async function updateStatus(id, status) {
    setChanging(id);
    try {
      const res = await fetch(`http://localhost:3001/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, updatedAt: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success("Order updated");
      fetchOrders();
    } catch (e) {
      console.error(e);
      toast.error("Update failed");
    } finally {
      setChanging(null);
    }
  }

  async function removeOrder(id) {
    if (!window.confirm("Delete order?")) return;
    try {
      const res = await fetch(`http://localhost:3001/orders/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Order deleted");
      fetchOrders();
    } catch (e) {
      console.error(e);
      toast.error("Delete failed");
    }
  }

  if (loading) return <div className="p-6">Loading orders...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Orders</h2>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b">
            <tr>
              <th className="p-3 text-left">Order</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Qty</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Created</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b hover:bg-gray-50">
                <td className="p-3 flex items-center gap-3">
                  <img src={o.image} alt="" className="w-12 h-10 object-cover rounded" />
                  <div>
                    <div className="font-medium">{o.title}</div>
                    <div className="text-xs text-gray-500">{o.id}</div>
                  </div>
                </td>
                <td className="p-3">{o.email}</td>
                <td className="p-3">{o.qty}</td>
                <td className="p-3">${o.price}</td>
                <td className="p-3"><StatusBadge status={o.status} /></td>
                <td className="p-3">{o.createdAt ? new Date(o.createdAt).toLocaleString() : "-"}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="border p-1"
                      disabled={changing === o.id}
                    >
                      <option value="pending">pending</option>
                      <option value="shipped">shipped</option>
                      <option value="delivered">delivered</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                    <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => removeOrder(o.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan="7" className="p-4 text-center text-gray-500">No orders</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
