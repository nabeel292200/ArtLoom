// src/admin/AdminUsers.jsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FaUser,
  FaEnvelope,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
  FaSearch,
  FaFilter,
  FaShieldAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaUserSlash,
  FaEye,
  FaLock,
  FaUnlock,
  FaCalendarAlt,
  FaPhone,
  FaMapMarkerAlt,
  FaSync
} from "react-icons/fa";

// Status Badge Component
function StatusBadge({ status }) {
  const statusConfig = {
    active: {
      bg: "bg-emerald-500/20",
      text: "text-emerald-400",
      border: "border-emerald-500/30",
      icon: <FaCheckCircle className="w-3 h-3" />
    },
    inactive: {
      bg: "bg-yellow-500/20",
      text: "text-yellow-400",
      border: "border-yellow-500/30",
      icon: <FaUserSlash className="w-3 h-3" />
    },
    blocked: {
      bg: "bg-red-500/20",
      text: "text-red-400",
      border: "border-red-500/30",
      icon: <FaLock className="w-3 h-3" />
    },
    pending: {
      bg: "bg-blue-500/20",
      text: "text-blue-400",
      border: "border-blue-500/30",
      icon: <FaEye className="w-3 h-3" />
    }
  };

  const config = statusConfig[status] || {
    bg: "bg-gray-500/20",
    text: "text-gray-400",
    border: "border-gray-500/30",
    icon: <FaUser className="w-3 h-3" />
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${config.bg} ${config.border}`}>
      {config.icon}
      <span className={`text-xs font-medium ${config.text}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  );
}

// Admin Badge Component
function AdminBadge({ isAdmin, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all hover:scale-105 ${
        isAdmin
          ? "bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30"
          : "bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-gray-500/30"
      }`}
    >
      <FaShieldAlt className="w-3 h-3" />
      <span className="text-xs font-medium">
        {isAdmin ? "Admin" : "User"}
      </span>
    </button>
  );
}

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState({});

  // Search and Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [adminFilter, setAdminFilter] = useState("All");

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/users");
      if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);
      
      const data = await res.json();
      
      // Process and validate user data
      const processedUsers = (data || []).map(user => ({
        id: user.id || user._id,
        name: user.name || user.username || "Unnamed User",
        email: user.email || "No email",
        phone: user.phone || user.mobile || user.contact || "N/A",
        address: user.address || user.location || "N/A",
        status: user.status || user.accountStatus || "inactive",
        isAdmin: Boolean(user.isAdmin || user.admin || false),
        createdAt: user.createdAt || user.joinDate || new Date().toISOString(),
        lastLogin: user.lastLogin || "Never",
        orders: user.orders || user.orderCount || 0
      }));
      
      setUsers(processedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Could not load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function removeUser(id) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`http://localhost:3001/users/${id}`, {
        method: "DELETE",
      });
      
      if (!res.ok) throw new Error("Delete failed");

      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Delete failed");
    }
  }

  function startEdit(user) {
    setEditingId(user.id);
    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      status: user.status || "inactive",
      isAdmin: Boolean(user.isAdmin)
    });
  }

  async function saveEdit(id) {
    try {
      const body = { 
        ...form, 
        isAdmin: Boolean(form.isAdmin)
      };
      
      const res = await fetch(`http://localhost:3001/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success("User updated successfully");
      setEditingId(null);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Update failed");
    }
  }

  async function toggleAdmin(user) {
    try {
      const res = await fetch(`http://localhost:3001/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          isAdmin: !user.isAdmin,
          updatedAt: new Date().toISOString()
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      toast.success(`Admin permissions ${!user.isAdmin ? "granted" : "revoked"}`);
      fetchUsers();
    } catch (error) {
      console.error("Error toggling admin:", error);
      toast.error("Update failed");
    }
  }

  async function updateStatus(id, status) {
    try {
      const res = await fetch(`http://localhost:3001/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          status,
          updatedAt: new Date().toISOString()
        }),
      });

      if (!res.ok) throw new Error("Status update failed");

      toast.success(`User status updated to ${status}`);
      fetchUsers();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Status update failed");
    }
  }

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      search === "" ||
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.phone.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "All" || 
      user.status === statusFilter;
    
    const matchesAdmin = 
      adminFilter === "All" ||
      (adminFilter === "Admin" && user.isAdmin) ||
      (adminFilter === "User" && !user.isAdmin);
    
    return matchesSearch && matchesStatus && matchesAdmin;
  });

  // Stats
  const stats = {
    total: users.length,
    active: users.filter(u => u.status === "active").length,
    admins: users.filter(u => u.isAdmin).length,
    blocked: users.filter(u => u.status === "blocked").length
  };

  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-br from-gray-900 to-gray-950">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="mt-4 text-gray-400">Loading users...</div>
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
            👤 User Management
          </h1>
          <p className="text-gray-400 mt-2">Manage all system users and permissions</p>
        </div>
        
        <button
          onClick={fetchUsers}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl flex items-center gap-2 transition-all hover:scale-105"
        >
          <FaSync className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-2xl border border-gray-800/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Total Users</div>
              <div className="text-2xl font-bold text-white">{stats.total}</div>
            </div>
            <div className="p-2 rounded-xl bg-blue-500/20">
              <FaUser className="w-5 h-5 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-2xl border border-gray-800/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Active</div>
              <div className="text-2xl font-bold text-white">{stats.active}</div>
            </div>
            <div className="p-2 rounded-xl bg-emerald-500/20">
              <FaCheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-2xl border border-gray-800/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Admins</div>
              <div className="text-2xl font-bold text-white">{stats.admins}</div>
            </div>
            <div className="p-2 rounded-xl bg-purple-500/20">
              <FaShieldAlt className="w-5 h-5 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-4 rounded-2xl border border-gray-800/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Blocked</div>
              <div className="text-2xl font-bold text-white">{stats.blocked}</div>
            </div>
            <div className="p-2 rounded-xl bg-red-500/20">
              <FaLock className="w-5 h-5 text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 p-4 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-800/50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition appearance-none"
            >
              <option value="All">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Admin Filter */}
          <div className="relative">
            <FaShieldAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={adminFilter}
              onChange={(e) => setAdminFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 transition appearance-none"
            >
              <option value="All">All Users</option>
              <option value="Admin">Admins Only</option>
              <option value="User">Regular Users</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-800/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800/50">
                <th className="text-left p-4 text-sm font-semibold text-gray-400">User</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Contact</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Status</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Role</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center">
                    <div className="text-gray-400 text-lg">No users found</div>
                    <div className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-800/30 hover:bg-gray-800/20 transition-colors">
                    {/* User Info */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                          <span className="text-white font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="text-white font-medium">
                            {editingId === user.id ? (
                              <input
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="px-3 py-1.5 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm w-full"
                              />
                            ) : (
                              user.name
                            )}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">
                            Joined {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <FaEnvelope className="w-3 h-3 text-gray-400" />
                          {editingId === user.id ? (
                            <input
                              value={form.email}
                              onChange={(e) => setForm({ ...form, email: e.target.value })}
                              className="px-3 py-1.5 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm w-full"
                            />
                          ) : (
                            <span className="text-white">{user.email}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <FaPhone className="w-3 h-3 text-gray-400" />
                          {editingId === user.id ? (
                            <input
                              value={form.phone}
                              onChange={(e) => setForm({ ...form, phone: e.target.value })}
                              className="px-3 py-1.5 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm w-full"
                            />
                          ) : (
                            <span className="text-gray-300">{user.phone}</span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      {editingId === user.id ? (
                        <select
                          value={form.status}
                          onChange={(e) => setForm({ ...form, status: e.target.value })}
                          className="px-3 py-1.5 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="blocked">Blocked</option>
                          <option value="pending">Pending</option>
                        </select>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <StatusBadge status={user.status} />
                          <div className="flex gap-1">
                            {["active", "inactive", "blocked"].map(status => (
                              <button
                                key={status}
                                onClick={() => updateStatus(user.id, status)}
                                className={`text-xs px-2 py-1 rounded ${
                                  user.status === status
                                    ? "bg-gray-800 text-white"
                                    : "bg-gray-800/30 text-gray-400 hover:text-white"
                                }`}
                              >
                                {status.charAt(0).toUpperCase()}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Admin Role */}
                    <td className="p-4">
                      {editingId === user.id ? (
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!form.isAdmin}
                            onChange={(e) => setForm({ ...form, isAdmin: e.target.checked })}
                            className="rounded border-gray-700 bg-gray-800 text-blue-500"
                          />
                          <span className="text-sm text-gray-300">Admin</span>
                        </label>
                      ) : (
                        <AdminBadge 
                          isAdmin={user.isAdmin} 
                          onClick={() => toggleAdmin(user)}
                        />
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {editingId === user.id ? (
                          <>
                            <button
                              onClick={() => saveEdit(user.id)}
                              className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 rounded-lg text-emerald-300 hover:text-emerald-200 text-sm transition-all flex items-center gap-1"
                            >
                              <FaSave className="w-3 h-3" />
                              Save
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700/50 rounded-lg text-gray-300 hover:text-white text-sm transition-all flex items-center gap-1"
                            >
                              <FaTimes className="w-3 h-3" />
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-300 hover:text-blue-200 text-sm transition-all flex items-center gap-1"
                            >
                              <FaEye className="w-3 h-3" />
                              View
                            </button>
                            <button
                              onClick={() => startEdit(user)}
                              className="px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 rounded-lg text-yellow-300 hover:text-yellow-200 text-sm transition-all flex items-center gap-1"
                            >
                              <FaEdit className="w-3 h-3" />
                              Edit
                            </button>
                            <button
                              onClick={() => removeUser(user.id)}
                              className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-300 hover:text-red-200 text-sm transition-all flex items-center gap-1"
                            >
                              <FaTrash className="w-3 h-3" />
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-800/50 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">User Details</h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <FaTimes className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* User Header */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-2xl text-white font-bold">
                      {selectedUser.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedUser.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={selectedUser.status} />
                      <AdminBadge isAdmin={selectedUser.isAdmin} />
                    </div>
                  </div>
                </div>

                {/* User Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400">Email</div>
                    <div className="text-white font-medium">{selectedUser.email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Phone</div>
                    <div className="text-white font-medium">{selectedUser.phone}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Joined</div>
                    <div className="text-white font-medium">
                      {new Date(selectedUser.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Last Login</div>
                    <div className="text-white font-medium">{selectedUser.lastLogin}</div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <div className="text-sm text-gray-400 mb-2">Address</div>
                  <div className="p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
                    <div className="flex items-start gap-2">
                      <FaMapMarkerAlt className="w-4 h-4 text-emerald-400 mt-0.5" />
                      <div className="text-white text-sm">{selectedUser.address}</div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => {
                      updateStatus(selectedUser.id, 
                        selectedUser.status === "active" ? "blocked" : "active"
                      );
                      setSelectedUser(null);
                    }}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                      selectedUser.status === "active"
                        ? "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
                        : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30"
                    }`}
                  >
                    {selectedUser.status === "active" ? "Block User" : "Activate"}
                  </button>
                  <button
                    onClick={() => {
                      toggleAdmin(selectedUser);
                      setSelectedUser(null);
                    }}
                    className="px-4 py-2 rounded-lg border border-purple-500/30 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 text-sm font-medium transition-all"
                  >
                    {selectedUser.isAdmin ? "Remove Admin" : "Make Admin"}
                  </button>
                  <button
                    onClick={() => startEdit(selectedUser)}
                    className="px-4 py-2 rounded-lg border border-blue-500/30 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-sm font-medium transition-all"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}