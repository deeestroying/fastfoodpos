import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("darkMode") === "true");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return (
    <div className="h-screen w-64 bg-gray-900 text-white fixed top-0 left-0 flex flex-col shadow-lg">
      {/* Sidebar Header */}
      <div className="text-2xl font-bold text-center py-6 bg-gray-800 shadow-md">
        🍽️ POS System
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col space-y-3 px-4 mt-4">
        <SidebarLink to="/dashboard" icon="📊" label="Dashboard" active={location.pathname === "/dashboard"} />
        <SidebarLink to="/checkout" icon="🛒" label="Checkout" active={location.pathname === "/checkout"} />
        <SidebarLink to="/order-history" icon="📦" label="Order History" active={location.pathname === "/order-history"} />
        <SidebarLink to="/manage-promos" icon="🎟️" label="Promo Codes" active={location.pathname === "/manage-promos"} />

        {/* Admin-Only Links */}
        {user?.role === "admin" && (
          <>
            <SidebarLink to="/menu-management" icon="📜" label="Menu" active={location.pathname === "/menu-management"} />
            <SidebarLink to="/inventory-management" icon="📦" label="Inventory" active={location.pathname === "/inventory-management"} />
            <SidebarLink to="/sales-report" icon="📈" label="Reports" active={location.pathname === "/sales-report"} />
            <SidebarLink to="/user-management" icon="👥" label="User Management" active={location.pathname === "/user-management"} />
          </>
        )}
      </nav>

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="mt-6 mx-4 py-2 bg-gray-700 rounded text-center hover:bg-gray-600 transition duration-200"
      >
        {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      {/* Logout & Profile Section */}
      <div className="mt-auto mb-6 px-4">
        <Link to="/profile" className="block py-2 px-3 bg-gray-700 rounded text-center hover:bg-gray-600">
          👤 Profile
        </Link>
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to logout?")) {
              logout();
            }
          }}
          className="w-full mt-3 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition duration-200"
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

// Sidebar Link Component
const SidebarLink = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`py-2 px-3 rounded flex items-center transition ${
      active ? "bg-blue-500 text-white" : "hover:bg-gray-700"
    }`}
  >
    {icon} {label}
  </Link>
);
