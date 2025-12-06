// src/admin/adminsidebar.jsx
import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function AdminSidebar() {
  const [open, setOpen] = useState(true);

  const links = [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/orders", label: "Orders" },
    { to: "/admin/products", label: "Products" },
    { to: "/admin/users", label: "Users" },
  ];

  return (
    <aside className={`bg-gray-900 text-white ${open ? "w-64" : "w-16"} min-h-screen transition-all duration-300 flex flex-col`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500 rounded-full w-9 h-9 flex items-center justify-center font-bold">A</div>
          {open && <div className="text-lg font-semibold">Admin Panel</div>}
        </div>

        <button
          onClick={() => setOpen((s) => !s)}
          className="text-gray-300 px-2 py-1 rounded hover:bg-gray-800"
        >
          {open ? "◀" : "▶"}
        </button>
      </div>

      <nav className="flex-1 mt-4">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mx-2 my-1 rounded-lg transition ${
                isActive ? "bg-gray-800" : "hover:bg-gray-800"
              }`
            }
          >
            <div className="w-6 text-indigo-400 font-semibold">{l.label.charAt(0)}</div>
            {open && <span>{l.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => {
            localStorage.removeItem("isAdmin");
            localStorage.removeItem("user");
            window.location.href = "/";
          }}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
