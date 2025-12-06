// src/admin/admindashboard.jsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchAll() {
    setLoading(true);
    try {
      const [uRes, pRes, oRes] = await Promise.all([
        fetch("http://localhost:3001/users"),
        fetch("http://localhost:3001/products"),
        fetch("http://localhost:3001/orders"),
      ]);

      if (!uRes.ok || !pRes.ok || !oRes.ok) {
        throw new Error("Fetch error");
      }

      const [u, p, o] = await Promise.all([uRes.json(), pRes.json(), oRes.json()]);
      setUsers(u || []);
      setProducts(p || []);
      setOrders(o || []);
    } catch (e) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  const revenue = orders.reduce(
    (s, o) => s + Number(o.price || 0) * Number(o.qty || 1),
    0
  );

  const outOfStock = products.filter((p) => Number(p.stock) <= 0).length;
  const inactiveUsers = users.filter((u) => u.status !== "active").length;

  if (loading) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl shadow">
          <div className="text-sm text-gray-500">Users</div>
          <div className="text-2xl font-bold">{users.length}</div>
          <div className="text-xs text-gray-400 mt-1">{inactiveUsers} inactive/blocked</div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <div className="text-sm text-gray-500">Products</div>
          <div className="text-2xl font-bold">{products.length}</div>
          <div className="text-xs text-gray-400 mt-1">{outOfStock} out of stock</div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <div className="text-sm text-gray-500">Revenue</div>
          <div className="text-2xl font-bold">${revenue}</div>
          <div className="text-xs text-gray-400 mt-1">{orders.length} orders</div>
        </div>
      </div>
    </div>
  );
}
