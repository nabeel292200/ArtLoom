// src/admin/AdminProducts.jsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaImage,
  FaBox,
  FaTag,
  FaUser,
  FaDollarSign,
  FaMapMarkerAlt,
  FaWarehouse,
  FaEye,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaRupeeSign,
  FaArrowUp,
  FaArrowDown,
  FaSync,
  FaShoppingCart
} from "react-icons/fa";

// Stock Badge Component
function StockBadge({ stock }) {
  const stockNum = Number(stock) || 0;
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
      stockNum > 10 
        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
        : stockNum > 0
        ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
        : "bg-red-500/20 text-red-400 border border-red-500/30"
    }`}>
      Stock: {stockNum}
    </span>
  );
}

// Quick Stock Update Component
function QuickStockUpdate({ product, onUpdate, disabled }) {
  const [localStock, setLocalStock] = useState(product.stock);
  const [updating, setUpdating] = useState(false);

  const handleUpdate = async (newStock) => {
    if (updating) return;
    
    setUpdating(true);
    try {
      await onUpdate(product.id, newStock);
      setLocalStock(newStock);
      toast.success(`Stock updated to ${newStock}`);
    } catch (error) {
      toast.error("Failed to update stock");
    } finally {
      setUpdating(false);
    }
  };

  const adjustStock = (amount) => {
    const newStock = Math.max(0, localStock + amount);
    setLocalStock(newStock);
    handleUpdate(newStock);
  };

  const setExactStock = () => {
    const input = window.prompt(`Set stock for "${product.title}"`, localStock);
    if (input !== null) {
      const newStock = parseInt(input);
      if (!isNaN(newStock) && newStock >= 0) {
        handleUpdate(newStock);
      } else {
        toast.error("Please enter a valid number");
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => adjustStock(-1)}
        disabled={updating || disabled}
        className="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-300 hover:text-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <FaArrowDown className="w-3 h-3" />
      </button>
      
      <button
        onClick={setExactStock}
        disabled={updating || disabled}
        className="px-3 py-1.5 bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium min-w-[60px]"
      >
        {updating ? (
          <FaSync className="w-3 h-3 mx-auto animate-spin" />
        ) : (
          localStock
        )}
      </button>
      
      <button
        onClick={() => adjustStock(1)}
        disabled={updating || disabled}
        className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-lg text-emerald-300 hover:text-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <FaArrowUp className="w-3 h-3" />
      </button>
    </div>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [updatingStock, setUpdatingStock] = useState(null);
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    price: "",
    place: "",
    image: "",
    description: "",
    stock: 0
  });

  // Search and Filter
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [stockFilter, setStockFilter] = useState("all");

  // Fetch products from API
  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/products");
      if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
      
      const data = await res.json();
      
      // Process the data to ensure consistency
      const processedProducts = (data || []).map(product => ({
        id: product.id || product._id,
        title: product.title || product.name || "Untitled Product",
        author: product.author || product.artist || product.creator || "",
        category: product.category || product.type || "Uncategorized",
        price: parseFloat(product.price) || 0,
        place: product.place || product.location || product.country || "",
        image: product.image || product.imageUrl || product.thumbnail || "/placeholder-image.jpg",
        description: product.description || product.desc || "",
        stock: parseInt(product.stock) || parseInt(product.quantity) || 0,
        createdAt: product.createdAt || product.date || new Date().toISOString()
      }));
      
      setProducts(processedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Could not load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  // Update stock quantity
  async function updateStock(productId, newStock) {
    setUpdatingStock(productId);
    try {
      const res = await fetch(`http://localhost:3001/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          stock: parseInt(newStock),
          updatedAt: new Date().toISOString()
        }),
      });
      
      if (!res.ok) throw new Error("Stock update failed");
      
      // Update local state immediately
      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, stock: parseInt(newStock) } : p
      ));
      
      return true;
    } catch (error) {
      console.error("Error updating stock:", error);
      throw error;
    } finally {
      setUpdatingStock(null);
    }
  }

  // Bulk stock update
  async function bulkStockUpdate(operation) {
    const amount = window.prompt(`Enter amount to ${operation}`, "1");
    if (!amount || isNaN(amount)) return;
    
    const numAmount = parseInt(amount);
    if (numAmount <= 0) {
      toast.error("Please enter a positive number");
      return;
    }
    
    const selectedProducts = filteredProducts.filter(p => 
      operation === "increase" || (operation === "decrease" && p.stock >= numAmount)
    );
    
    if (selectedProducts.length === 0) {
      toast.error(`No products available for ${operation}`);
      return;
    }
    
    if (!window.confirm(`${operation.charAt(0).toUpperCase() + operation.slice(1)} stock by ${numAmount} for ${selectedProducts.length} products?`)) return;
    
    try {
      const promises = selectedProducts.map(product => {
        const newStock = operation === "increase" 
          ? product.stock + numAmount
          : Math.max(0, product.stock - numAmount);
        
        return updateStock(product.id, newStock);
      });
      
      await Promise.all(promises);
      toast.success(`Stock ${operation}d for ${selectedProducts.length} products`);
    } catch (error) {
      toast.error("Bulk update failed");
    }
  }

  // Start editing a product
  function startEdit(product) {
    setEditingId(product.id);
    setCreating(false);
    setForm({
      title: product.title || "",
      author: product.author || "",
      category: product.category || "",
      price: product.price || "",
      place: product.place || "",
      image: product.image || "",
      description: product.description || "",
      stock: product.stock || 0,
    });
  }

  // Save edited product
  async function saveEdit(id) {
    if (!form.title || !form.price) {
      return toast.error("Title and price are required");
    }
    
    try {
      const body = { 
        ...form, 
        stock: Number(form.stock) || 0,
        price: parseFloat(form.price) || 0
      };
      
      const res = await fetch(`http://localhost:3001/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      
      if (!res.ok) throw new Error("Update failed");
      
      toast.success("Product updated successfully");
      setEditingId(null);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    }
  }

  // Delete product
  async function removeProduct(id) {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      const res = await fetch(`http://localhost:3001/products/${id}`, { 
        method: "DELETE" 
      });
      
      if (!res.ok) throw new Error("Delete failed");
      
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  }

  // Create new product
  async function createProduct() {
    if (!form.title || !form.price) {
      return toast.error("Title and price are required");
    }
    
    try {
      const body = { 
        ...form, 
        stock: Number(form.stock) || 0,
        price: parseFloat(form.price) || 0
      };
      
      const res = await fetch("http://localhost:3001/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      
      if (!res.ok) throw new Error("Create failed");
      
      toast.success("Product created successfully");
      setForm({
        title: "",
        author: "",
        category: "",
        price: "",
        place: "",
        image: "",
        description: "",
        stock: 0
      });
      setCreating(false);
      fetchProducts();
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product");
    }
  }

  // Filter and sort products
  const categories = ["All", ...new Set(products.map(p => p.category).filter(Boolean))];
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      search === "" ||
      product.title.toLowerCase().includes(search.toLowerCase()) ||
      product.author.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = 
      categoryFilter === "All" || 
      product.category === categoryFilter;
    
    const matchesStock = 
      stockFilter === "all" ||
      (stockFilter === "in-stock" && product.stock > 0) ||
      (stockFilter === "out-of-stock" && product.stock === 0) ||
      (stockFilter === "low-stock" && product.stock > 0 && product.stock <= 10);
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-high":
        return b.price - a.price;
      case "price-low":
        return a.price - b.price;
      case "stock-high":
        return b.stock - a.stock;
      case "stock-low":
        return a.stock - b.stock;
      case "name-asc":
        return a.title.localeCompare(b.title);
      case "name-desc":
        return b.title.localeCompare(a.title);
      default: // newest
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  // Stats
  const stats = {
    total: products.length,
    inStock: products.filter(p => p.stock > 0).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock <= 10).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
    totalStock: products.reduce((sum, p) => sum + p.stock, 0)
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="mt-4 text-gray-400">Loading products...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            🎨 Product Management
          </h1>
          <p className="text-gray-400 mt-2">Manage your product catalog</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setCreating(!creating);
              setEditingId(null);
              if (!creating) {
                setForm({
                  title: "",
                  author: "",
                  category: "",
                  price: "",
                  place: "",
                  image: "",
                  description: "",
                  stock: 0
                });
              }
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl flex items-center gap-2 transition-all hover:scale-105"
          >
            <FaPlus className="w-4 h-4" />
            {creating ? "Cancel" : "Add Product"}
          </button>
          <button
            onClick={fetchProducts}
            className="px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700/50 text-gray-300 rounded-xl flex items-center gap-2 transition-all"
          >
            <FaSync className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-2xl border border-gray-800/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Total Products</div>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
            </div>
            <div className="p-2 rounded-xl bg-blue-500/20">
              <FaBox className="w-5 h-5 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-2xl border border-gray-800/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">In Stock</div>
              <div className="text-2xl font-bold text-white">{stats.inStock}</div>
            </div>
            <div className="p-2 rounded-xl bg-emerald-500/20">
              <FaWarehouse className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-2xl border border-gray-800/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Low Stock (≤10)</div>
              <div className="text-2xl font-bold text-white">{stats.lowStock}</div>
            </div>
            <div className="p-2 rounded-xl bg-yellow-500/20">
              <FaBox className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-2xl border border-gray-800/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Total Stock</div>
              <div className="text-2xl font-bold text-white">{stats.totalStock}</div>
            </div>
            <div className="p-2 rounded-xl bg-purple-500/20">
              <FaShoppingCart className="w-5 h-5 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Stock Actions */}
      <div className="mb-6 p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-800/50">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">Quick Stock Management</h3>
            <p className="text-sm text-gray-400">Bulk update stock quantities</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => bulkStockUpdate("increase")}
              className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-lg text-emerald-300 hover:text-emerald-200 transition-all flex items-center gap-2"
            >
              <FaArrowUp className="w-4 h-4" />
              Increase All
            </button>
            <button
              onClick={() => bulkStockUpdate("decrease")}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-300 hover:text-red-200 transition-all flex items-center gap-2"
            >
              <FaArrowDown className="w-4 h-4" />
              Decrease All
            </button>
          </div>
        </div>
      </div>

      {/* Create Product Form */}
      {creating && (
        <div className="mb-8 p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-800/50">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <FaPlus className="w-5 h-5 text-blue-400" />
            Create New Product
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Product Title *</label>
              <input
                placeholder="Enter product title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Author/Artist</label>
              <input
                placeholder="Enter author or artist name"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Category</label>
              <input
                placeholder="Enter category"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Price (₹) *</label>
              <input
                type="number"
                placeholder="0.00"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Place/Location</label>
              <input
                placeholder="Enter location"
                value={form.place}
                onChange={(e) => setForm({ ...form, place: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400">Initial Stock</label>
              <input
                type="number"
                placeholder="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3 space-y-2">
              <label className="text-sm text-gray-400">Image URL</label>
              <input
                placeholder="https://example.com/image.jpg"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition"
              />
            </div>

            <div className="md:col-span-2 lg:col-span-3 space-y-2">
              <label className="text-sm text-gray-400">Description</label>
              <textarea
                placeholder="Enter product description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows="3"
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition resize-none"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={createProduct}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-xl flex items-center gap-2 transition-all hover:scale-105"
            >
              <FaSave className="w-4 h-4" />
              Create Product
            </button>
            <button
              onClick={() => {
                setCreating(false);
                setForm({});
              }}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-700/50 text-gray-300 rounded-xl flex items-center gap-2 transition-all"
            >
              <FaTimes className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="mb-6 p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-800/50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition appearance-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div className="relative">
            <FaWarehouse className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition appearance-none"
            >
              <option value="all">All Stock</option>
              <option value="in-stock">In Stock</option>
              <option value="out-of-stock">Out of Stock</option>
              <option value="low-stock">Low Stock (≤ 10)</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="relative">
            <FaSortAmountDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition appearance-none"
            >
              <option value="newest">Newest First</option>
              <option value="name-asc">Name: A-Z</option>
              <option value="name-desc">Name: Z-A</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="stock-high">Stock: High to Low</option>
              <option value="stock-low">Stock: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedProducts.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <div className="text-gray-400 text-lg">No products found</div>
            <div className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</div>
          </div>
        ) : (
          sortedProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-800/50 overflow-hidden hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl"
            >
              {/* Product Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <StockBadge stock={product.stock} />
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5">
                {/* Title */}
                {editingId === product.id ? (
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white mb-2"
                  />
                ) : (
                  <h3 className="text-lg font-bold text-white truncate">
                    {product.title}
                  </h3>
                )}

                {/* Author */}
                {editingId === product.id ? (
                  <input
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white mb-2"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                    <FaUser className="w-3 h-3" />
                    {product.author || "Unknown"}
                  </div>
                )}

                {/* Category & Location */}
                <div className="flex items-center gap-3 mt-3 text-sm">
                  <div className="flex items-center gap-1">
                    <FaTag className="w-3 h-3 text-blue-400" />
                    <span className="text-gray-300">{product.category}</span>
                  </div>
                  {product.place && (
                    <div className="flex items-center gap-1">
                      <FaMapMarkerAlt className="w-3 h-3 text-emerald-400" />
                      <span className="text-gray-300">{product.place}</span>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-2xl font-bold text-emerald-400">
                    ₹{product.price.toLocaleString('en-IN')}
                  </div>
                  {editingId === product.id && (
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="w-24 px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white"
                    />
                  )}
                </div>

                {/* Quick Stock Update */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-400">Stock Management</div>
                  <QuickStockUpdate 
                    product={product}
                    onUpdate={updateStock}
                    disabled={editingId === product.id || updatingStock === product.id}
                  />
                </div>

                {/* Description (truncated) */}
                {product.description && (
                  <p className="mt-3 text-gray-400 text-sm line-clamp-2">
                    {product.description}
                  </p>
                )}

                {/* Edit Form Fields (if editing) */}
                {editingId === product.id && (
                  <div className="mt-4 space-y-2">
                    <input
                      placeholder="Category"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white"
                    />
                    <input
                      placeholder="Place"
                      value={form.place}
                      onChange={(e) => setForm({ ...form, place: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white"
                    />
                    <input
                      placeholder="Image URL"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white"
                    />
                    <textarea
                      placeholder="Description"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white"
                      rows="2"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-6 flex gap-3">
                  {editingId === product.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(product.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-lg text-emerald-300 hover:text-emerald-200 transition-all"
                      >
                        <FaSave className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700/50 rounded-lg text-gray-300 hover:text-white transition-all"
                      >
                        <FaTimes className="w-4 h-4" />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(product)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-300 hover:text-blue-200 transition-all"
                      >
                        <FaEdit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => removeProduct(product.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-300 hover:text-red-200 transition-all"
                      >
                        <FaTrash className="w-4 h-4" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stock Update Instructions */}
      <div className="mt-8 p-4 bg-gray-800/20 rounded-xl border border-gray-700/30">
        <h4 className="text-sm font-semibold text-white mb-2">Stock Update Instructions</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-500/20 rounded">
              <FaArrowDown className="w-3 h-3 text-red-400" />
            </div>
            <span>Decrease stock by 1</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gray-800/50 rounded min-w-[60px] text-center">
              42
            </div>
            <span>Click to set exact quantity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/20 rounded">
              <FaArrowUp className="w-3 h-3 text-emerald-400" />
            </div>
            <span>Increase stock by 1</span>
          </div>
        </div>
      </div>
    </div>
  );
}