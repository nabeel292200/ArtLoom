// src/admin/privateadmin.jsx
import { Navigate } from "react-router-dom";

export default function PrivateAdmin({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/login" />;
  if (!user.isAdmin) return <Navigate to="/" />;

  return children;
}
