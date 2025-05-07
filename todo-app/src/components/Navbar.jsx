import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Get current page name dynamically
  const pageTitle = {
    "/dashboard": "📊 Dashboard",
    "/checkout": "🛒 Checkout",
    "/order-history": "📦 Order History",
    "/manage-promos": "🎟️ Promo Codes",
    "/menu-management": "📜 Menu",
    "/inventory-management": "📦 Inventory",
    "/sales-report": "📈 Reports",
    "/user-management": "👥 User Management",
    "/profile": "👤 Profile",
  }[location.pathname] || "🍽️ POS System";

  return (
    <nav className="fixed top-0 left-64 right-0 bg-gray-800 text-white flex justify-between items-center px-6 py-3 shadow-md">
      {/* Page Title */}
      <h2 className="text-lg font-semibold">{pageTitle}</h2>

      {/* Right-side buttons */}
      <div className="flex items-center space-x-4">
        <Link to="/profile" className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
          👤 Profile
        </Link>
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to logout?")) {
              logout();
            }
          }}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          🚪 Logout
        </button>
      </div>
    </nav>
  );
}
