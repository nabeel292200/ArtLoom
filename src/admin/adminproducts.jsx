// src/admin/adminproducts.jsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({});

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data || []);
    } catch (e) {
      console.error(e);
      toast.error("Could not load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  function startEdit(p) {
    setEditingId(p.id);
    setCreating(false);
    setForm({
      title: p.title || "",
      author: p.author || "",
      category: p.category || "",
      price: p.price || "",
      place: p.place || "",
      image: p.image || "",
      description: p.description || "",
      stock: Number(p.stock) || 0,
    });
  }

  async function saveEdit(id) {
    try {
      const body = { ...form, stock: Number(form.stock || 0) };
      const res = await fetch(`http://localhost:3001/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Update failed");
      toast.success("Product updated");
      setEditingId(null);
      fetchProducts();
    } catch (e) {
      console.error(e);
      toast.error("Update failed");
    }
  }

  async function removeProduct(id) {
    if (!window.confirm("Delete product?")) return;
    try {
      const res = await fetch(`http://localhost:3001/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Product deleted");
      fetchProducts();
    } catch (e) {
      console.error(e);
      toast.error("Delete failed");
    }
  }

  async function createProduct() {
    if (!form.title || form.price === undefined) return toast.error("Title & price are required");
    try {
      const body = { ...form, stock: Number(form.stock || 0) };
      const res = await fetch("http://localhost:3001/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Create failed");
      toast.success("Product created");
      setForm({});
      setCreating(false);
      fetchProducts();
    } catch (e) {
      console.error(e);
      toast.error("Create failed");
    }
  }

  if (loading) return <div className="p-6">Loading products...</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Products</h2>
        <div>
          {creating ? (
            <button onClick={() => { setCreating(false); setForm({}); }} className="bg-gray-200 px-3 py-1 rounded">Cancel</button>
          ) : (
            <button onClick={() => { setCreating(true); setEditingId(null); setForm({}); }} className="bg-indigo-600 text-white px-3 py-1 rounded">Add Product</button>
          )}
        </div>
      </div>

      {creating && (
        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <h3 className="font-semibold mb-3">Create Product</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input placeholder="Title" value={form.title||""} onChange={(e)=>setForm({...form,title:e.target.value})} className="border p-2" />
            <input placeholder="Author" value={form.author||""} onChange={(e)=>setForm({...form,author:e.target.value})} className="border p-2" />
            <input placeholder="Category" value={form.category||""} onChange={(e)=>setForm({...form,category:e.target.value})} className="border p-2" />
            <input placeholder="Price" type="number" value={form.price||""} onChange={(e)=>setForm({...form,price:e.target.value})} className="border p-2" />
            <input placeholder="Place" value={form.place||""} onChange={(e)=>setForm({...form,place:e.target.value})} className="border p-2" />
            <input placeholder="Image URL" value={form.image||""} onChange={(e)=>setForm({...form,image:e.target.value})} className="border p-2" />
            <input placeholder="Stock" type="number" value={form.stock||0} onChange={(e)=>setForm({...form,stock:Number(e.target.value)})} className="border p-2" />
            <textarea placeholder="Description" value={form.description||""} onChange={(e)=>setForm({...form,description:e.target.value})} className="border p-2 md:col-span-2" />
          </div>
          <div className="mt-3">
            <button onClick={createProduct} className="bg-green-600 text-white px-4 py-2 rounded">Create</button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b">
            <tr>
              <th className="p-3">Preview</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="p-3"><img src={p.image} alt="" className="w-20 h-14 object-cover rounded" /></td>
                <td className="p-3">
                  {editingId === p.id ? <input className="border p-1 w-full" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} /> : p.title}
                </td>
                <td className="p-3">{editingId === p.id ? <input className="border p-1" value={form.category} onChange={(e)=>setForm({...form,category:e.target.value})} /> : p.category}</td>
                <td className="p-3">{editingId === p.id ? <input className="border p-1 w-24" value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})} /> : `$${p.price}`}</td>
                <td className="p-3">
                  {editingId === p.id ? <input type="number" className="border p-1 w-24" value={form.stock} onChange={(e)=>setForm({...form,stock:Number(e.target.value)})} /> : <span className={`px-2 py-1 rounded ${Number(p.stock) <= 0 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{p.stock}</span>}
                </td>
                <td className="p-3">
                  {editingId === p.id ? (
                    <>
                      <button className="mr-2 bg-indigo-600 text-white px-3 py-1 rounded" onClick={() => saveEdit(p.id)}>Save</button>
                      <button className="bg-gray-200 px-3 py-1 rounded" onClick={() => setEditingId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="mr-2 bg-indigo-600 text-white px-3 py-1 rounded" onClick={() => startEdit(p)}>Edit</button>
                      <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => removeProduct(p.id)}>Delete</button>
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
