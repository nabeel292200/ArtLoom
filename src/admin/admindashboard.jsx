// src/admin/admindashboard.jsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { 
  FaUsers, 
  FaBox, 
  FaShoppingCart, 
  FaRupeeSign, 
  FaExclamationTriangle,
  FaUserSlash,
  FaArrowUp,
  FaArrowDown,
  FaChartLine,
  FaCalendarAlt,
  FaSync,
  FaCheckCircle,
  FaClock,
  FaDollarSign
} from "react-icons/fa";

// Simple Graph Component with theme matching
function LineGraph({ values = [], label = "", color = "#6366f1" }) {
  const max = Math.max(...values, 10);
  const points = values
    .map((v, i) => `${(i / (values.length - 1)) * 200}, ${80 - (v / max) * 70}`)
    .join(" ");

  return (
    <div className="w-full p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-xl border border-gray-800/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <FaChartLine className="text-blue-400" />
          {label}
        </h2>
        <span className="text-xs px-3 py-1 rounded-full bg-gray-800 text-gray-300 flex items-center gap-1">
          <FaCalendarAlt className="w-3 h-3" />
          Last {values.length} days
        </span>
      </div>

      <div className="relative">
        <svg viewBox="0 0 200 80" className="w-full h-40 overflow-visible">
          {/* Grid lines */}
          <line x1="0" y1="20" x2="200" y2="20" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="0" y1="40" x2="200" y2="40" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="0" y1="60" x2="200" y2="60" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          
          {/* Gradient fill under line */}
          <defs>
            <linearGradient id={`gradient-${label}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Filled area */}
          <path d={`M0,80 L${points} L200,80`} fill={`url(#gradient-${label})`} />
          
          {/* Main line */}
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
          
          {/* Data points */}
          {values.map((v, i) => {
            const x = (i / (values.length - 1)) * 200;
            const y = 80 - (v / max) * 70;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="4"
                fill={color}
                stroke="white"
                strokeWidth="2"
                className="hover:r-6 transition-all"
              />
            );
          })}
        </svg>
        
        {/* Current value indicator */}
        <div className="absolute top-0 right-0 bg-gray-800/50 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-700/50">
          <div className="text-xs text-gray-400">Current</div>
          <div className="text-lg font-bold text-white">{values[values.length - 1] || 0}</div>
        </div>
      </div>
      
      {/* Trend indicator */}
      {values.length > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700/50">
          <div className="text-sm text-gray-400">
            {values[values.length - 1] > values[0] ? (
              <span className="text-green-400 flex items-center gap-1">
                <FaArrowUp className="w-3 h-3" />
                {(((values[values.length - 1] - values[0]) / values[0]) * 100).toFixed(1)}% increase
              </span>
            ) : values[values.length - 1] < values[0] ? (
              <span className="text-red-400 flex items-center gap-1">
                <FaArrowDown className="w-3 h-3" />
                {(((values[0] - values[values.length - 1]) / values[0]) * 100).toFixed(1)}% decrease
              </span>
            ) : (
              <span className="text-gray-400">No change</span>
            )}
          </div>
          <div className="text-xs text-gray-500">
            Peak: {Math.max(...values)}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    users: [],
    products: [],
    orders: [],
    loading: true,
    stats: {
      totalUsers: 0,
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      outOfStock: 0,
      pendingOrders: 0,
      completedOrders: 0,
      activeUsers: 0,
      inactiveUsers: 0
    }
  });

  // Process data to calculate real statistics
  const processData = (users, products, orders) => {
    // Calculate revenue from orders
    const totalRevenue = orders.reduce((sum, order) => {
      return sum + (parseFloat(order.total) || 0);
    }, 0);

    // Count out of stock products
    const outOfStock = products.filter(product => {
      const stock = parseInt(product.stock) || 0;
      return stock <= 0;
    }).length;

    // Count order statuses
    const pendingOrders = orders.filter(order => 
      order.status && order.status.toLowerCase() === 'pending'
    ).length;
    
    const completedOrders = orders.filter(order => 
      order.status && order.status.toLowerCase() === 'completed'
    ).length;

    // Count user statuses (assuming 'isActive' field or similar)
    const activeUsers = users.filter(user => 
      user.isActive === true || user.status === 'active'
    ).length;
    
    const inactiveUsers = users.filter(user => 
      user.isActive === false || user.status === 'inactive'
    ).length;

    return {
      totalUsers: users.length,
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue,
      outOfStock,
      pendingOrders,
      completedOrders,
      activeUsers,
      inactiveUsers
    };
  };

  // Generate chart data from orders
  const generateChartData = (orders) => {
    if (!orders || orders.length === 0) return { ordersChart: [], revenueChart: [] };

    // Group orders by date (last 7 days)
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    // Initialize daily data
    const dailyOrders = {};
    const dailyRevenue = {};
    
    last7Days.forEach(date => {
      dailyOrders[date] = 0;
      dailyRevenue[date] = 0;
    });

    // Aggregate data
    orders.forEach(order => {
      if (order.createdAt) {
        const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
        if (dailyOrders[orderDate] !== undefined) {
          dailyOrders[orderDate] = (dailyOrders[orderDate] || 0) + 1;
          dailyRevenue[orderDate] = (dailyRevenue[orderDate] || 0) + (parseFloat(order.total) || 0);
        }
      }
    });

    // Convert to arrays for chart
    const ordersChart = last7Days.map(date => dailyOrders[date]);
    const revenueChart = last7Days.map(date => dailyRevenue[date]);

    return { ordersChart, revenueChart };
  };

  async function fetchDashboardData() {
    try {
      setDashboardData(prev => ({ ...prev, loading: true }));

      // Fetch data from your endpoints
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        fetch("http://localhost:3001/users"),
        fetch("http://localhost:3001/products"),
        fetch("http://localhost:3001/orders")
      ]);

      if (!usersRes.ok || !productsRes.ok || !ordersRes.ok) {
        throw new Error(`Failed to fetch data: ${usersRes.status} ${productsRes.status} ${ordersRes.status}`);
      }

      const [usersData, productsData, ordersData] = await Promise.all([
        usersRes.json(),
        productsRes.json(),
        ordersRes.json()
      ]);

      // Process the data
      const stats = processData(usersData, productsData, ordersData);
      const { ordersChart, revenueChart } = generateChartData(ordersData);

      setDashboardData({
        users: usersData,
        products: productsData,
        orders: ordersData,
        loading: false,
        stats,
        ordersChart,
        revenueChart
      });

      toast.success("Dashboard data updated successfully!");

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
      setDashboardData(prev => ({ ...prev, loading: false }));
    }
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const { loading, stats, ordersChart, revenueChart } = dashboardData;

  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="mt-4 text-gray-400">Loading dashboard data...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            📊 Dashboard Overview
          </h1>
          <p className="text-gray-400 mt-2">Real-time statistics from your database</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl flex items-center gap-2 transition-all hover:scale-105"
        >
          <FaSync className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* TOP STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Users Card */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-800/50 backdrop-blur-sm hover:border-blue-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <FaUsers className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-400">
                {stats.activeUsers} active
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.totalUsers}</div>
            <div className="text-sm text-gray-400">Total Users</div>
            <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
              <FaUserSlash className="w-3 h-3 text-red-400" />
              <span>{stats.inactiveUsers} inactive</span>
            </div>
          </div>
        </div>

        {/* Products Card */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-purple-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-800/50 backdrop-blur-sm hover:border-purple-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-purple-500/20">
                <FaBox className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-400">
                {stats.outOfStock} out of stock
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.totalProducts}</div>
            <div className="text-sm text-gray-400">Total Products</div>
            <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
              <FaExclamationTriangle className="w-3 h-3 text-amber-400" />
              <span>{(stats.totalProducts - stats.outOfStock)} in stock</span>
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-800/50 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-emerald-500/20">
                <FaShoppingCart className="w-6 h-6 text-emerald-400" />
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400">
                  {stats.completedOrders} completed
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
                  {stats.pendingOrders} pending
                </span>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.totalOrders}</div>
            <div className="text-sm text-gray-400">Total Orders</div>
            <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
              <FaClock className="w-3 h-3 text-yellow-400" />
              <span>Processing</span>
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-xl border border-gray-800/50 backdrop-blur-sm hover:border-amber-500/30 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-amber-500/20">
                <FaRupeeSign className="w-6 h-6 text-amber-400" />
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-400">
                Avg: ₹{stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(0) : 0}
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">₹{stats.totalRevenue.toLocaleString('en-IN')}</div>
            <div className="text-sm text-gray-400">Total Revenue</div>
            <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
              <FaCheckCircle className="w-3 h-3 text-green-400" />
              <span>From {stats.totalOrders} orders</span>
            </div>
          </div>
        </div>
      </div>

      {/* GRAPHS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <LineGraph
          label="Daily Orders"
          values={ordersChart && ordersChart.length > 0 ? ordersChart : [0, 0, 0, 0, 0, 0, 0]}
          color="#10b981" // Emerald
        />

        <LineGraph
          label="Daily Revenue (₹)"
          values={revenueChart && revenueChart.length > 0 ? revenueChart : [0, 0, 0, 0, 0, 0, 0]}
          color="#f59e0b" // Amber
        />
      </div>

      {/* BOTTOM METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800/30 p-5 rounded-2xl border border-gray-700/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">User Conversion</div>
              <div className="text-2xl font-bold text-white mt-1">
                {stats.totalUsers > 0 ? ((stats.totalOrders / stats.totalUsers) * 100).toFixed(1) : 0}%
              </div>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/20">
              <FaUsers className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800/30 p-5 rounded-2xl border border-gray-700/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Stock Coverage</div>
              <div className="text-2xl font-bold text-white mt-1">
                {stats.totalProducts > 0 ? (((stats.totalProducts - stats.outOfStock) / stats.totalProducts) * 100).toFixed(1) : 0}%
              </div>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/20">
              <FaBox className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800/30 p-5 rounded-2xl border border-gray-700/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Order Completion</div>
              <div className="text-2xl font-bold text-white mt-1">
                {stats.totalOrders > 0 ? ((stats.completedOrders / stats.totalOrders) * 100).toFixed(1) : 0}%
              </div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/20">
              <FaShoppingCart className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-800/30 p-5 rounded-2xl border border-gray-700/30">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Active Users</div>
              <div className="text-2xl font-bold text-white mt-1">
                {stats.totalUsers > 0 ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1) : 0}%
              </div>
            </div>
            <div className="p-3 rounded-xl bg-green-500/20">
              <FaCheckCircle className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* DATA SOURCE INFO */}
      <div className="mt-8 p-4 bg-gray-800/20 rounded-xl border border-gray-700/30">
        <div className="text-sm text-gray-400 flex items-center gap-2">
          <FaSync className="w-4 h-4" />
          Data fetched from: http://localhost:3001
        </div>
        <div className="grid grid-cols-3 gap-4 mt-3">
          <div className="text-xs text-gray-500">
            <span className="text-gray-400">Users:</span> {dashboardData.users.length} records
          </div>
          <div className="text-xs text-gray-500">
            <span className="text-gray-400">Products:</span> {dashboardData.products.length} records
          </div>
          <div className="text-xs text-gray-500">
            <span className="text-gray-400">Orders:</span> {dashboardData.orders.length} records
          </div>
        </div>
      </div>
    </div>
  );
}