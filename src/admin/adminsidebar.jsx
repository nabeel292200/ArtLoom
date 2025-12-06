// src/admin/adminsidebar.jsx
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  FaTachometerAlt, 
  FaShoppingCart, 
  FaBox, 
  FaUsers, 
  FaSignOutAlt,
  FaStar
} from "react-icons/fa";
import { 
  FiChevronLeft, 
  FiChevronRight
} from "react-icons/fi";

export default function AdminSidebar() {
  const [open, setOpen] = useState(true);
  const [activeHover, setActiveHover] = useState(null);
  const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    users: 0,
    uptime: 100
  });

  // Fetch real stats from your API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Replace with your actual API calls
        // Example:
        // const ordersRes = await fetch('/api/orders/count');
        // const productsRes = await fetch('/api/products/count');
        // const usersRes = await fetch('/api/users/count');
        
        // For now, using localStorage or session data if available
        const storedOrders = localStorage.getItem('ordersCount');
        const storedProducts = localStorage.getItem('productsCount');
        const storedUsers = localStorage.getItem('usersCount');
        
        setStats({
          orders: storedOrders ? parseInt(storedOrders) : 0,
          products: storedProducts ? parseInt(storedProducts) : 0,
          users: storedUsers ? parseInt(storedUsers) : 0,
          uptime: 100 // You can calculate this based on your system
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    
    fetchStats();
    
    // You might want to refresh stats periodically or on certain events
    const interval = setInterval(fetchStats, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Calculate badge counts from stats
  const links = [
    { 
      to: "/admin", 
      label: "Dashboard", 
      icon: FaTachometerAlt, 
      color: "text-blue-400",
      description: "Overview & Stats",
      badge: null
    },
    { 
      to: "/admin/orders", 
      label: "Orders", 
      icon: FaShoppingCart, 
      color: "text-emerald-400",
      description: "Manage orders",
      badge: stats.orders > 0 ? stats.orders.toString() : null
    },
    { 
      to: "/admin/products", 
      label: "Products", 
      icon: FaBox, 
      color: "text-purple-400",
      description: "Product catalog",
      badge: stats.products > 0 ? stats.products.toString() : null
    },
    { 
      to: "/admin/users", 
      label: "Users", 
      icon: FaUsers, 
      color: "text-pink-400",
      description: "User management",
      badge: stats.users > 0 ? stats.users.toString() : null
    },
  ];

  const handleSignOut = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const NavItem = ({ link, isCollapsed }) => {
    const Icon = link.icon;
    return (
      <NavLink
        to={link.to}
        onMouseEnter={() => setActiveHover(link.to)}
        onMouseLeave={() => setActiveHover(null)}
        className={({ isActive }) =>
          `relative flex items-center gap-3 px-4 py-4 mx-2 rounded-2xl transition-all duration-300 group ${
            isActive
              ? "bg-gradient-to-r from-gray-800/80 to-gray-800/40 shadow-lg border border-gray-700/50"
              : "hover:bg-gray-800/30 hover:border-gray-700/30 border border-transparent"
          }`
        }
      >
        {/* Animated background on hover */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${link.color.replace('text-', 'from-')}/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
        
        {/* Icon container */}
        <div className={`relative p-2.5 rounded-xl ${activeHover === link.to ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`}>
          <div className={`p-2 rounded-lg bg-gray-800/50 ${link.color} group-hover:shadow-lg`} style={{
            boxShadow: activeHover === link.to ? `0 0 20px ${link.color.replace('text-', '')}40` : 'none'
          }}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        
        {/* Label and description - Only shown when expanded */}
        {!isCollapsed && (
          <div className="relative flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-200 group-hover:text-white transition-colors truncate">
                {link.label}
              </span>
              {/* Badge with real count */}
              {link.badge && (
                <span className={`ml-2 px-2 py-1 text-xs rounded-full min-w-[20px] text-center ${
                  link.label === "Orders" 
                    ? "bg-emerald-500/20 text-emerald-300" 
                    : link.label === "Products"
                    ? "bg-purple-500/20 text-purple-300"
                    : "bg-pink-500/20 text-pink-300"
                }`}>
                  {link.badge}
                </span>
              )}
            </div>
            {/* Description */}
            <div className="text-xs text-gray-400 mt-1 truncate">
              {link.description}
            </div>
            {/* Hover underline effect */}
            <div className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-transparent via-current to-transparent transition-all duration-500"></div>
          </div>
        )}
        
        {/* Active indicator dot */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <div className={`w-2 h-2 rounded-full ${link.color.replace('text-', 'bg-')} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
        </div>
      </NavLink>
    );
  };

  return (
    <aside className={`relative bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 text-white ${open ? "w-72" : "w-20"} min-h-screen transition-all duration-500 ease-out flex flex-col border-r border-gray-800/50 shadow-2xl`}>
      {/* Decorative gradient accent line */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500"></div>
      
      {/* Glass morphism effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm"></div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header Section - Simplified */}
        <div className="p-6 border-b border-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Logo/Avatar */}
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold shadow-lg shadow-blue-500/25">
                  <FaStar className="w-6 h-6" />
                </div>
                {/* Online status indicator */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-gray-900 rounded-full"></div>
              </div>
              
              {/* Panel Title - Only shown when expanded */}
              {open && (
                <div className="flex flex-col">
                  <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Admin
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Control Panel</div>
                </div>
              )}
            </div>

            {/* Collapse/Expand Button */}
            <button
              onClick={() => setOpen((s) => !s)}
              className="p-2 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800 hover:border-gray-600 transition-all duration-300 hover:scale-110 group"
              aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
            >
              {open ? (
                <FiChevronLeft className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
              ) : (
                <FiChevronRight className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
              )}
            </button>
          </div>

          {/* Search Bar REMOVED */}
        </div>

        {/* Navigation - Only the 4 main items */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {links.map((link) => (
              <NavItem key={link.to} link={link} isCollapsed={!open} />
            ))}
          </div>
          
          {/* Real Stats Section - Only shown when expanded */}
          {open && (
            <div className="mt-8 px-4 py-4 bg-gray-800/20 rounded-2xl border border-gray-700/30">
              <div className="text-sm font-medium text-gray-300 mb-3">Current Stats</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-gray-800/30 rounded-xl">
                  <div className="text-2xl font-bold text-emerald-400">
                    {stats.orders}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Orders</div>
                </div>
                <div className="text-center p-3 bg-gray-800/30 rounded-xl">
                  <div className="text-2xl font-bold text-purple-400">
                    {stats.products}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Products</div>
                </div>
                <div className="text-center p-3 bg-gray-800/30 rounded-xl">
                  <div className="text-2xl font-bold text-pink-400">
                    {stats.users}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Users</div>
                </div>
                <div className="text-center p-3 bg-gray-800/30 rounded-xl">
                  <div className="text-2xl font-bold text-blue-400">
                    {stats.uptime}%
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Uptime</div>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-800/50 space-y-4">
          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            onMouseEnter={() => setActiveHover('logout')}
            onMouseLeave={() => setActiveHover(null)}
            className="relative group w-full px-4 py-3.5 rounded-2xl bg-gradient-to-r from-red-900/20 to-red-800/10 hover:from-red-900/40 hover:to-red-800/30 border border-red-500/20 hover:border-red-500/40 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
          >
            {/* Animated shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            
            {/* Icon */}
            <div className="relative p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20">
              <FaSignOutAlt className="w-5 h-5 text-red-400 group-hover:text-red-300" />
            </div>
            
            {/* Label - Only shown when expanded */}
            {open && (
              <span className="relative font-medium text-red-300 group-hover:text-red-200">
                Sign Out
              </span>
            )}
          </button>

          {/* User Profile - Simplified, removed "Administrator" text */}
          {open && (
            <div className="px-4 pt-4 border-t border-gray-800/50">
              <div className="flex items-center gap-3">
                {/* User avatar */}
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center shadow-lg">
                    <div className="text-sm font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {/* You can display user initials here */}
                      {localStorage.getItem('user') ? 
                        JSON.parse(localStorage.getItem('user')).name?.charAt(0).toUpperCase() || 'A' 
                        : 'A'}
                    </div>
                  </div>
                  {/* Online status */}
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 border-2 border-gray-900 rounded-full"></div>
                </div>
                
                {/* User info - Simplified */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {localStorage.getItem('user') ? 
                      JSON.parse(localStorage.getItem('user')).name || 'Admin' 
                      : 'Admin User'}
                  </div>
                  <div className="text-xs text-gray-400 truncate">
                    {localStorage.getItem('user') ? 
                      JSON.parse(localStorage.getItem('user')).email || 'admin@example.com' 
                      : 'admin@example.com'}
                  </div>
                </div>
              </div>
              
              {/* System Status - Real data */}
              <div className="mt-4 text-xs">
                <div className="flex items-center justify-between text-gray-400 mb-2">
                  <span>System Status</span>
                  <span className="flex items-center gap-1 text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    {stats.uptime === 100 ? 'Operational' : 'Partial'}
                  </span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      stats.uptime >= 90 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                      stats.uptime >= 70 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
                      'bg-gradient-to-r from-red-400 to-pink-500'
                    }`}
                    style={{ width: `${stats.uptime}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}