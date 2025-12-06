// src/admin/adminusers.jsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data || []);
    } catch (e) {
      console.error(e);
      toast.error("Could not load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function removeUser(id) {
    if (!window.confirm("Delete user?")) return;
    try {
      const res = await fetch(`http://localhost:3001/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("User deleted");
      fetchUsers();
    } catch (e) {
      console.error(e);
      toast.error("Delete failed");
    }
  }

  function startEdit(u) {
    setEditingId(u.id);
    setForm({ name: u.name || "", email: u.email || "", status: u.status || "inactive", isAdmin: !!u.isAdmin });
  }

  async function saveEdit(id) {
    try {
      const body = { ...form };
      // ensure booleans/numbers are properly typed
      body.isAdmin = !!body.isAdmin;
      const res = await fetch(`http://localhost:3001/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success("User updated");
      setEditingId(null);
      fetchUsers();
    } catch (e) {
      console.error(e);
      toast.error("Update failed");
    }
  }

  async function toggleAdmin(u) {
    try {
      const res = await fetch(`http://localhost:3001/users/${u.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAdmin: !u.isAdmin }),
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success("Admin flag updated");
      fetchUsers();
    } catch (e) {
      console.error(e);
      toast.error("Update failed");
    }
  }

  if (loading) return <div className="p-6">Loading users...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Users</h2>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Admin</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  {editingId === u.id ? (
                    <input className="border p-2 w-full" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  ) : (
                    u.name
                  )}
                </td>
                <td className="p-3">
                  {editingId === u.id ? (
                    <input className="border p-2 w-full" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  ) : (
                    u.email
                  )}
                </td>
                <td className="p-3">
                  {editingId === u.id ? (
                    <select className="border p-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      <option value="active">active</option>
                      <option value="inactive">inactive</option>
                      <option value="blocked">blocked</option>
                    </select>
                  ) : (
                    <span className={`px-2 py-1 rounded ${u.status === "active" ? "bg-green-100 text-green-700" : u.status === "blocked" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>{u.status}</span>
                  )}
                </td>
                <td className="p-3">
                  {editingId === u.id ? (
                    <input type="checkbox" checked={!!form.isAdmin} onChange={(e) => setForm({ ...form, isAdmin: e.target.checked })} />
                  ) : (
                    <button onClick={() => toggleAdmin(u)} className={`px-3 py-1 rounded ${u.isAdmin ? "bg-green-600 text-white" : "bg-gray-200"}`}>
                      {u.isAdmin ? "Yes" : "Make Admin"}
                    </button>
                  )}
                </td>
                <td className="p-3">
                  {editingId === u.id ? (
                    <>
                      <button className="mr-2 bg-indigo-600 text-white px-3 py-1 rounded" onClick={() => saveEdit(u.id)}>Save</button>
                      <button className="bg-gray-200 px-3 py-1 rounded" onClick={() => setEditingId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="mr-2 bg-indigo-600 text-white px-3 py-1 rounded" onClick={() => startEdit(u)}>Edit</button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => removeUser(u.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
