// src/admin/AdminOrders.jsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaTrash,
  FaEye,
  FaArrowLeft,
  FaArrowRight,
  FaFilter,
  FaCalendarAlt,
  FaRupeeSign,
  FaBox,
  FaUser,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaShoppingCart,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt
} from "react-icons/fa";

// Modern Status Badge
function StatusBadge({ status }) {
  const statusConfig = {
    Pending: {
      bg: "bg-yellow-500/20",
      text: "text-yellow-400",
      border: "border-yellow-500/30",
      icon: <FaClock className="w-3 h-3" />
    },
    Processing: {
      bg: "bg-blue-500/20",
      text: "text-blue-400",
      border: "border-blue-500/30",
      icon: <FaClock className="w-3 h-3" />
    },
    Shipped: {
      bg: "bg-indigo-500/20",
      text: "text-indigo-400",
      border: "border-indigo-500/30",
      icon: <FaTruck className="w-3 h-3" />
    },
    Delivered: {
      bg: "bg-emerald-500/20",
      text: "text-emerald-400",
      border: "border-emerald-500/30",
      icon: <FaCheckCircle className="w-3 h-3" />
    },
    Cancelled: {
      bg: "bg-red-500/20",
      text: "text-red-400",
      border: "border-red-500/30",
      icon: <FaTimesCircle className="w-3 h-3" />
    },
    Refunded: {
      bg: "bg-gray-500/20",
      text: "text-gray-400",
      border: "border-gray-500/30",
      icon: <FaTimesCircle className="w-3 h-3" />
    }
  };

  const config = statusConfig[status] || {
    bg: "bg-gray-500/20",
    text: "text-gray-400",
    border: "border-gray-500/30",
    icon: <FaBox className="w-3 h-3" />
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${config.bg} ${config.border}`}>
      {config.icon}
      <span className={`text-xs font-medium ${config.text}`}>
        {status}
      </span>
    </div>
  );
}

// Extract user information from order
function getUserInfo(order) {
  // Try different possible user field structures
  if (order.user && typeof order.user === 'object') {
    return {
      name: order.user.name || order.user.username || order.user.email?.split('@')[0] || 'Customer',
      email: order.user.email || 'N/A',
      phone: order.user.phone || order.user.contact || 'N/A',
      address: order.user.address || 'N/A'
    };
  }
  
  return {
    name: order.customerName || order.userName || order.user || 'Customer',
    email: order.email || 'N/A',
    phone: order.phone || 'N/A',
    address: order.shippingAddress || order.address || 'N/A'
  };
}

// Calculate total price
function calculateTotalPrice(order) {
  if (order.total) {
    return parseFloat(order.total);
  }
  
  if (order.items && Array.isArray(order.items)) {
    return order.items.reduce((total, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || parseInt(item.qty) || 1;
      return total + (price * quantity);
    }, 0);
  }
  
  return 0;
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [changing, setChanging] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Search and Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  // Pagination
  const [page, setPage] = useState(1);
  const perPage = 9;

  // Fetch orders from your API
  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/orders");
      if (!res.ok) throw new Error(`Failed to fetch orders: ${res.status}`);

      const data = await res.json();
      console.log("Raw orders data:", data); // For debugging
      
      // Process and validate orders data
      const processedOrders = (data || []).map(order => {
        const userInfo = getUserInfo(order);
        const total = calculateTotalPrice(order);
        const items = Array.isArray(order.items) ? order.items : 
                     Array.isArray(order.products) ? order.products : 
                     order.item ? [order.item] : [];
        
        return {
          id: order.id || order._id || `order-${Date.now()}`,
          userId: order.userId || order.user?._id || 'N/A',
          ...userInfo,
          total,
          items,
          status: order.status || 'Pending',
          createdAt: order.createdAt || order.date || new Date().toISOString(),
          shippingAddress: order.shippingAddress || order.address || 'N/A',
          paymentMethod: order.paymentMethod || 'N/A',
          notes: order.notes || ''
        };
      });

      // Sort based on selected option
      let sortedOrders;
      switch (sortBy) {
        case "newest":
          sortedOrders = processedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case "oldest":
          sortedOrders = processedOrders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          break;
        case "price-high":
          sortedOrders = processedOrders.sort((a, b) => b.total - a.total);
          break;
        case "price-low":
          sortedOrders = processedOrders.sort((a, b) => a.total - b.total);
          break;
        default:
          sortedOrders = processedOrders;
      }

      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Could not load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, [sortBy]);

  // Update order status
  async function updateStatus(id, status) {
    setChanging(id);
    try {
      const res = await fetch(`http://localhost:3001/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status, 
          updatedAt: new Date().toISOString() 
        }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      toast.success("Order status updated successfully");
      fetchOrders(); // Refresh data
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setChanging(null);
    }
  }

  // Delete order
  async function removeOrder(id) {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const res = await fetch(`http://localhost:3001/orders/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      toast.success("Order deleted successfully");
      fetchOrders(); // Refresh data
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    }
  }

  // Filter and search
  const filteredOrders = orders.filter(order => {
    const userInfo = getUserInfo(order);
    const matchesSearch = 
      search === "" ||
      userInfo.name.toLowerCase().includes(search.toLowerCase()) ||
      userInfo.email.toLowerCase().includes(search.toLowerCase()) ||
      order.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = 
      statusFilter === "All" || 
      order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / perPage));
  const startIndex = (page - 1) * perPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + perPage);

  // Statistics
  const stats = {
    total: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
    pending: orders.filter(o => o.status === "Pending" || o.status === "Processing").length,
    delivered: orders.filter(o => o.status === "Delivered").length,
    cancelled: orders.filter(o => o.status === "Cancelled" || o.status === "Refunded").length,
    shipped: orders.filter(o => o.status === "Shipped").length
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="mt-4 text-gray-400">Loading orders...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          📦 Order Management
        </h1>
        <p className="text-gray-400 mt-2">Manage and track all customer orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-2xl border border-gray-800/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Total Orders</div>
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
              <div className="text-sm text-gray-400">Total Revenue</div>
              <div className="text-2xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</div>
            </div>
            <div className="p-2 rounded-xl bg-emerald-500/20">
              <FaRupeeSign className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-2xl border border-gray-800/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Pending</div>
              <div className="text-2xl font-bold text-white">{stats.pending}</div>
            </div>
            <div className="p-2 rounded-xl bg-yellow-500/20">
              <FaClock className="w-5 h-5 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-2xl border border-gray-800/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Delivered</div>
              <div className="text-2xl font-bold text-white">{stats.delivered}</div>
            </div>
            <div className="p-2 rounded-xl bg-green-500/20">
              <FaCheckCircle className="w-5 h-5 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-800/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer name, email, or order ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition appearance-none"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="relative">
            <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition appearance-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedOrders.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <div className="text-gray-400 text-lg">No orders found</div>
            <div className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</div>
          </div>
        ) : (
          paginatedOrders.map((order) => {
            const userInfo = getUserInfo(order);
            const totalAmount = calculateTotalPrice(order);
            const items = order.items || [];
            const itemCount = items.length;
            const firstItem = items[0];

            return (
              <div
                key={order.id}
                className="group bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-800/50 overflow-hidden hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl"
              >
                {/* Order Header */}
                <div className="p-5 border-b border-gray-800/50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-sm text-gray-400">Order ID</div>
                      <div className="font-mono text-sm text-white font-medium truncate">
                        #{order.id}
                      </div>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  {/* Customer Info */}
                  <div className="flex items-center gap-3 mt-4">
                    <div className="p-2 rounded-xl bg-blue-500/20">
                      <FaUser className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-400">Customer</div>
                      <div className="text-white font-medium truncate">{userInfo.name}</div>
                      <div className="text-xs text-gray-500 truncate">{userInfo.email}</div>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-5">
                  {/* Order Summary */}
                  <div className="mb-4 p-3 bg-gray-800/30 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm text-gray-400">Items</div>
                      <div className="text-sm text-white font-medium">{itemCount} item{itemCount !== 1 ? 's' : ''}</div>
                    </div>
                    
                    {firstItem && (
                      <div className="flex items-center gap-3">
                        {firstItem.image && (
                          <img
                            src={firstItem.image}
                            alt={firstItem.title || firstItem.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-white text-sm font-medium truncate">
                            {firstItem.title || firstItem.name || "Product"}
                          </div>
                          <div className="text-gray-400 text-xs">
                            {firstItem.price && `₹${firstItem.price}`} {firstItem.quantity && `× ${firstItem.quantity}`}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Info */}
                  <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                    <div>
                      <div className="text-gray-400">Date</div>
                      <div className="text-white">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400">Total Amount</div>
                      <div className="text-white font-semibold text-lg">{formatCurrency(totalAmount)}</div>
                    </div>
                  </div>

                  {/* Payment Info */}
                  {order.paymentMethod && (
                    <div className="mb-4 text-sm">
                      <div className="text-gray-400">Payment</div>
                      <div className="text-white">{order.paymentMethod}</div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-3">
                    {/* Status Selector */}
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      disabled={changing === order.id}
                      className="w-full p-2.5 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => removeOrder(order.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-300 hover:text-red-200 transition-all"
                      >
                        <FaTrash className="w-4 h-4" />
                        Delete
                      </button>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-300 hover:text-blue-200 transition-all"
                      >
                        <FaEye className="w-4 h-4" />
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-gray-400 text-sm">
            Showing {startIndex + 1} to {Math.min(startIndex + perPage, filteredOrders.length)} of {filteredOrders.length} orders
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-all flex items-center gap-2"
            >
              <FaArrowLeft className="w-4 h-4" />
              Previous
            </button>
            
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      page === pageNum
                        ? "bg-blue-500 text-white"
                        : "bg-gray-800/50 text-gray-400 hover:bg-gray-800"
                    } transition-all`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-all flex items-center gap-2"
            >
              Next
              <FaArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-800/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FaTimesCircle className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400">Order ID</div>
                    <div className="text-white font-mono">#{selectedOrder.id}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Status</div>
                    <StatusBadge status={selectedOrder.status} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Date</div>
                    <div className="text-white">{new Date(selectedOrder.createdAt).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Payment Method</div>
                    <div className="text-white">{selectedOrder.paymentMethod || 'N/A'}</div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="bg-gray-800/30 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <FaUser className="w-4 h-4" />
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-400">Name</div>
                      <div className="text-white">{selectedOrder.name || getUserInfo(selectedOrder).name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Email</div>
                      <div className="text-white">{selectedOrder.email || getUserInfo(selectedOrder).email}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Phone</div>
                      <div className="text-white">{selectedOrder.phone || getUserInfo(selectedOrder).phone}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Shipping Address</div>
                      <div className="text-white text-sm">{selectedOrder.shippingAddress}</div>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FaShoppingCart className="w-4 h-4" />
                    Order Items ({selectedOrder.items?.length || 0})
                  </h3>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, index) => {
                      const price = parseFloat(item.price) || 0;
                      const quantity = parseInt(item.quantity) || parseInt(item.qty) || 1;
                      const total = price * quantity;
                      
                      return (
                        <div key={index} className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl">
                          {item.image && (
                            <img src={item.image} alt={item.title || item.name} className="w-16 h-16 object-cover rounded-lg" />
                          )}
                          <div className="flex-1">
                            <div className="text-white font-medium">{item.title || item.name || "Item"}</div>
                            <div className="text-gray-400 text-sm">Quantity: {quantity}</div>
                            <div className="text-gray-400 text-sm">Price: {formatCurrency(price)} each</div>
                          </div>
                          <div className="text-white font-semibold">
                            {formatCurrency(total)}
                          </div>
                        </div>
                      );
                    })}
                    
                    {/* Total Amount */}
                    <div className="flex justify-between items-center p-4 bg-gray-800/50 rounded-xl">
                      <div className="text-lg font-bold text-white">Total Amount</div>
                      <div className="text-2xl font-bold text-emerald-400">
                        {formatCurrency(calculateTotalPrice(selectedOrder))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}