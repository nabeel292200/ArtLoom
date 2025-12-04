// AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Eye,
  Activity,
  BarChart3,
  Calendar,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronRight,
  MoreVertical,
  Download,
  Sparkles,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('week');
  const navigate = useNavigate();

  // ===== JSON SERVER DATA STATES =====
  const [stats, setStats] = useState([
    { title: "Total Revenue", value: "$0", change: "+0%", icon: <DollarSign className="w-6 h-6" />, color: "bg-gradient-to-r from-purple-500 to-pink-500" },
    { title: "Total Orders", value: "0", change: "+0%", icon: <ShoppingCart className="w-6 h-6" />, color: "bg-gradient-to-r from-blue-500 to-cyan-500" },
    { title: "Active Users", value: "0", change: "+0%", icon: <Users className="w-6 h-6" />, color: "bg-gradient-to-r from-green-500 to-emerald-500" },
    { title: "Products", value: "0", change: "+0%", icon: <Package className="w-6 h-6" />, color: "bg-gradient-to-r from-orange-500 to-red-500" },
  ]);

  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [chartData, setChartData] = useState([]);

  // ===== FETCH DATA FROM JSON SERVER =====
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const ordersRes = await fetch("http://localhost:3001/orders");
        const usersRes = await fetch("http://localhost:3001/users");
        const productsRes = await fetch("http://localhost:3001/products");
        const recentOrdersRes = await fetch("http://localhost:3001/orders?_sort=id&_order=desc&_limit=5");

        const orders = await ordersRes.json();
        const users = await usersRes.json();
        const products = await productsRes.json();
        const recentOrdersData = await recentOrdersRes.json();

        const totalRevenue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);
        const activeUsers = users.filter(u => u.status === 'active').length;

        // Calculate stats
        setStats([
          { 
            title: "Total Revenue", 
            value: `$${totalRevenue.toLocaleString()}`, 
            change: "+12.5%", 
            icon: <DollarSign className="w-6 h-6" />, 
            color: "bg-gradient-to-r from-purple-500 to-pink-500" 
          },
          { 
            title: "Total Orders", 
            value: orders.length.toString(), 
            change: "+8.2%", 
            icon: <ShoppingCart className="w-6 h-6" />, 
            color: "bg-gradient-to-r from-blue-500 to-cyan-500" 
          },
          { 
            title: "Active Users", 
            value: activeUsers.toString(), 
            change: "+5.7%", 
            icon: <Users className="w-6 h-6" />, 
            color: "bg-gradient-to-r from-green-500 to-emerald-500" 
          },
          { 
            title: "Products", 
            value: products.length.toString(), 
            change: "+3.4%", 
            icon: <Package className="w-6 h-6" />, 
            color: "bg-gradient-to-r from-orange-500 to-red-500" 
          },
        ]);

        // Format recent orders
        const formattedRecentOrders = recentOrdersData.slice(0, 5).map(order => ({
          id: `#${order.id}`,
          customer: order.customer?.name || `Customer ${order.id}`,
          amount: `$${order.amount || 0}`,
          status: order.status || 'Pending'
        }));
        setRecentOrders(formattedRecentOrders);

        // Sort top products by highest price
        const sortedTopProducts = [...products]
          .sort((a, b) => (b.price || 0) - (a.price || 0))
          .slice(0, 3)
          .map(p => ({
            name: p.name || `Product ${p.id}`,
            revenue: `$${p.price || 0}`,
            growth: "+" + Math.floor(Math.random() * 30) + "%"
          }));
        setTopProducts(sortedTopProducts);

        // Generate mock activity from orders
        const activities = recentOrdersData.slice(0, 3).map(order => ({
          type: 'order',
          title: 'New order received',
          description: `Order #${order.id} from ${order.customer?.name || 'Customer'}`,
          time: '2 minutes ago',
          icon: <Activity className="text-green-400" size={20} />,
          color: 'bg-green-500/20'
        }));
        
        // Add user registration activity if available
        if (users.length > 0) {
          activities.push({
            type: 'user',
            title: 'New user registered',
            description: `${users[0]?.name || 'New user'} joined`,
            time: '15 minutes ago',
            icon: <Users className="text-blue-400" size={20} />,
            color: 'bg-blue-500/20'
          });
        }
        setRecentActivity(activities);

        // Generate upcoming tasks
        const tasks = [
          {
            title: 'Inventory check',
            time: 'Tomorrow, 10 AM',
            icon: <Calendar className="text-purple-400" size={20} />,
            color: 'bg-purple-500/20'
          },
          {
            title: 'Sales report',
            time: 'Friday, 3 PM',
            icon: <ShoppingCart className="text-yellow-400" size={20} />,
            color: 'bg-yellow-500/20'
          },
          {
            title: 'Analytics review',
            time: 'Next Monday',
            icon: <BarChart3 className="text-blue-400" size={20} />,
            color: 'bg-blue-500/20'
          }
        ];
        setUpcomingTasks(tasks);

      } catch (error) {
        console.error("JSON Server Error:", error);
        // Fallback to mock data
        setRecentOrders([
          { id: "#ORD001", customer: "Alex Johnson", amount: "$249.99", status: "Completed" },
          { id: "#ORD002", customer: "Maria Garcia", amount: "$149.99", status: "Pending" },
          { id: "#ORD003", customer: "David Chen", amount: "$89.99", status: "Completed" }
        ]);
        
        setTopProducts([
          { name: 'Wireless Earbuds', revenue: '$12,480', growth: '+24%' },
          { name: 'Smart Watch', revenue: '$8,910', growth: '+18%' },
          { name: 'Laptop Stand', revenue: '$6,030', growth: '+12%' }
        ]);
      }
    };

    fetchDashboardData();
  }, []);

  // ===== CHART DATA =====
  useEffect(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = days.map(day => ({
      label: day,
      revenue: Math.floor(Math.random() * 5000) + 2000,
      orders: Math.floor(Math.random() * 50) + 20
    }));
    setChartData(data);
  }, [selectedTimeFrame]);

  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1);
  const maxOrders = Math.max(...chartData.map(d => d.orders), 1);

  // Quick actions
  const quickActions = [
    { title: "Add Product", action: () => navigate('/admin/addproduct'), icon: <Package /> },
    { title: "View Orders", action: () => navigate('/admin/orders'), icon: <ShoppingCart /> },
    { title: "Manage Users", action: () => navigate('/admin/users'), icon: <Users /> },
    { title: "Analytics", action: () => {}, icon: <BarChart3 /> }
  ];

  // Helper function for status colors
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'processing': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-gray-800/90 backdrop-blur-lg border-b border-gray-700 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-700 transition-all"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-2xl font-bold">Admin<span className="text-purple-400">Dash</span></h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <button className="p-2 hover:bg-gray-700 rounded-xl transition-all relative">
              <Bell size={22} className="text-gray-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>
            
            <button className="p-2 hover:bg-gray-700 rounded-xl transition-all">
              <Settings size={22} className="text-gray-300" />
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside className={`fixed top-16 left-0 bottom-0 w-64 bg-gray-800/50 backdrop-blur-lg border-r border-gray-700 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-all duration-300 z-40`}>
        <div className="p-6">
          <nav className="space-y-3">
            <button className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-purple-500/30 hover:from-purple-500/40 hover:to-pink-500/40 transition-all">
              <div className="flex items-center space-x-3">
                <BarChart3 size={22} className="text-purple-200" />
                <span className="font-medium text-purple-100">Dashboard</span>
              </div>
              <ChevronRight size={18} className="text-purple-200" />
            </button>
            
            <button onClick={() => navigate('/admin/products')} className="w-full flex items-center space-x-3 p-4 rounded-xl hover:bg-gray-700/50 border border-transparent hover:border-purple-500/20 transition-all">
              <Package size={22} className="text-blue-200" />
              <span className="font-medium">Products</span>
            </button>
            
            <button onClick={() => navigate('/admin/orders')} className="w-full flex items-center space-x-3 p-4 rounded-xl hover:bg-gray-700/50 border border-transparent hover:border-pink-500/20 transition-all">
              <ShoppingCart size={22} className="text-pink-200" />
              <span className="font-medium">Orders</span>
            </button>
            
            <button onClick={() => navigate('/admin/users')} className="w-full flex items-center space-x-3 p-4 rounded-xl hover:bg-gray-700/50 border border-transparent hover:border-cyan-500/20 transition-all">
              <Users size={22} className="text-cyan-200" />
              <span className="font-medium">Users</span>
            </button>
          </nav>

          <div className="mt-8">
            <h3 className="text-sm text-gray-400 mb-4 flex items-center">
              <Sparkles className="w-4 h-4 mr-2" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="w-full flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-gray-700/30 to-gray-800/30 hover:from-gray-700/50 hover:to-gray-800/50 border border-gray-600/20 transition-all"
                >
                  <span className="text-purple-200">{action.icon}</span>
                  <span className="text-sm">{action.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pt-24 lg:pl-64 p-6">
        {/* Welcome Header */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-gray-800/40 to-gray-900/40 backdrop-blur-lg border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 bg-clip-text text-transparent">
                Welcome to Admin Dashboard
              </h1>
              <p className="text-gray-400 mt-2">Here's what's happening with your store today</p>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20">
              <BarChart3 className="w-8 h-8 text-purple-200" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="relative overflow-hidden rounded-2xl group">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}></div>
              <div className="relative p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                    {stat.icon}
                  </div>
                  <div className="flex items-center space-x-1 text-green-200 bg-green-500/20 px-3 py-1 rounded-full">
                    <TrendingUp size={14} />
                    <span className="text-sm font-medium">{stat.change}</span>
                  </div>
                </div>
                <h3 className="text-3xl font-bold mb-2">{stat.value}</h3>
                <p className="text-white/90">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Recent Orders</h2>
              <button className="text-purple-400 hover:text-purple-300 transition-colors">
                View All →
              </button>
            </div>
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-800/30 to-gray-900/20 hover:from-gray-800/40 hover:to-gray-900/30 transition-all border border-gray-700/50">
                    <div>
                      <div className="font-bold">{order.id}</div>
                      <div className="text-sm text-gray-400">{order.customer}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xl text-green-300">{order.amount}</div>
                      <div className={`text-sm px-3 py-1 rounded-full inline-block mt-2 ${getStatusColor(order.status)}`}>
                        {order.status}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No recent orders</p>
                </div>
              )}
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Revenue Analytics</h2>
              <div className="flex items-center space-x-3">
                <select
                  value={selectedTimeFrame}
                  onChange={(e) => setSelectedTimeFrame(e.target.value)}
                  className="bg-gray-700/50 border border-gray-600 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 backdrop-blur-sm"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
                <button className="p-2 hover:bg-gray-700/50 rounded-xl transition-all">
                  <Download size={18} className="text-gray-300" />
                </button>
              </div>
            </div>
            
            {/* Chart Stats */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-3xl font-bold text-green-300">
                  ${chartData.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Total Revenue</div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                  <span className="text-sm text-gray-300">Revenue</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                  <span className="text-sm text-gray-300">Orders</span>
                </div>
              </div>
            </div>

            {/* Chart Container */}
            <div className="relative h-72">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div key={i} className="text-right pr-2">
                    ${(maxRevenue * (4 - i) / 4 / 1000).toFixed(0)}K
                  </div>
                ))}
              </div>

              {/* Chart Bars */}
              <div className="ml-12 h-full flex items-end space-x-2 pb-8">
                {chartData.map((item, index) => {
                  const barHeight = (item.revenue / maxRevenue) * 100;
                  const commissionHeight = (item.orders / maxOrders) * 60;
                  
                  return (
                    <div key={index} className="flex-1 group relative">
                      {/* Revenue Bar */}
                      <div 
                        className="relative w-full rounded-t-xl transition-all duration-300 group-hover:brightness-110 cursor-pointer"
                        style={{ 
                          height: `${barHeight}%`,
                          background: 'linear-gradient(to top, #8b5cf6, #ec4899, #f97316)'
                        }}
                      >
                        {/* Hover tooltip */}
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800/90 px-4 py-2 rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap border border-purple-500/30 backdrop-blur-sm">
                          <div className="font-bold text-green-300">${item.revenue.toLocaleString()}</div>
                          <div className="text-xs text-blue-300">{item.orders} orders</div>
                          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-gray-800/90 border-r border-b border-purple-500/30"></div>
                        </div>
                      </div>
                      
                      {/* Orders Overlay */}
                      <div 
                        className="absolute w-3/4 left-1/2 transform -translate-x-1/2 rounded-t-lg opacity-90"
                        style={{ 
                          height: `${commissionHeight}%`,
                          bottom: '0',
                          background: 'linear-gradient(to top, #3b82f6, #06b6d4)'
                        }}
                      ></div>
                      
                      {/* X-axis labels */}
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
                        {item.label}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* X-axis line */}
              <div className="ml-12 h-px bg-gray-600"></div>
            </div>

            {/* Summary Stats */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/20 rounded-xl p-4 border border-purple-500/20">
                <div className="text-sm text-purple-300 mb-1">Avg Daily Revenue</div>
                <div className="text-xl font-bold text-green-300">
                  ${(chartData.reduce((sum, item) => sum + item.revenue, 0) / chartData.length).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/20 rounded-xl p-4 border border-blue-500/20">
                <div className="text-sm text-blue-300 mb-1">Total Orders</div>
                <div className="text-xl font-bold text-cyan-300">
                  {chartData.reduce((sum, item) => sum + item.orders, 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Top Products */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
            <h3 className="font-bold mb-4 text-xl">Top Products</h3>
            <div className="space-y-4">
              {topProducts.length > 0 ? (
                topProducts.map((product, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-800/30 to-transparent hover:from-gray-800/40 transition-all">
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-green-400 text-sm">{product.growth}</div>
                    </div>
                    <div className="font-bold text-pink-300">{product.revenue}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Package className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p>No products available</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
            <h3 className="font-bold mb-4 text-xl">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-gray-800/30 to-transparent hover:from-gray-800/40 transition-all">
                    <div className={`p-3 rounded-xl ${activity.color}`}>
                      {activity.icon}
                    </div>
                    <div>
                      <div className="font-medium">{activity.title}</div>
                      <div className="text-sm text-gray-400">{activity.description}</div>
                      <div className="text-xs text-gray-500 mt-1">{activity.time}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <Activity className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Upcoming Tasks */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700">
            <h3 className="font-bold mb-4 text-xl">Upcoming Tasks</h3>
            <div className="space-y-4">
              {upcomingTasks.map((task, i) => (
                <div key={i} className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-gray-800/30 to-transparent hover:from-gray-800/40 transition-all">
                  <div className={`p-3 rounded-xl ${task.color}`}>
                    {task.icon}
                  </div>
                  <div>
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm text-gray-400">{task.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;