import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import "./index.css";

// Import Pages
import Home from "./pages/Home"; // ✅ Home Page (Welcome Message)
import Dashboard from "./pages/Dashboard"; // ✅ POS System
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import Receipt from "./pages/Receipt";
import MenuManagement from "./pages/MenuManagement";
import InventoryManagement from "./pages/InventoryManagement";
import CustomerManagement from "./pages/CustomerManagement";
import SalesReport from "./pages/SalesReport";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import KitchenView from "./pages/KitchenView";
import OrderHistory from "./pages/OrderHistory";
import UserManagement from "./pages/UserManagement";
import UserProfile from "./pages/UserProfile";
import ManagePromoCodes from "./pages/ManagePromoCodes";

const MainApp = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex">
          {/* ✅ Sidebar Fix - Always Visible */}
          <Sidebar />

          <div className="flex-1 ml-64"> {/* Ensure proper spacing for sidebar */}
            <Navbar />
            <div className="container mx-auto p-6">
              <Routes>
                {/* ✅ Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* ✅ Protected Routes for Logged-In Users */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/receipt" element={<ProtectedRoute><Receipt /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

                {/* ✅ Admin-Only Routes */}
                <Route path="/menu-management" element={<ProtectedRoute adminOnly={true}><MenuManagement /></ProtectedRoute>} />
                <Route path="/inventory-management" element={<ProtectedRoute adminOnly={true}><InventoryManagement /></ProtectedRoute>} />
                <Route path="/customer-management" element={<ProtectedRoute adminOnly={true}><CustomerManagement /></ProtectedRoute>} />
                <Route path="/order-history" element={<ProtectedRoute adminOnly={true}><OrderHistory /></ProtectedRoute>} />
                <Route path="/sales-report" element={<ProtectedRoute adminOnly={true}><SalesReport /></ProtectedRoute>} />
                <Route path="/analytics-dashboard" element={<ProtectedRoute adminOnly={true}><AnalyticsDashboard /></ProtectedRoute>} />
                <Route path="/user-management" element={<ProtectedRoute adminOnly={true}><UserManagement /></ProtectedRoute>} />
                <Route path="/manage-promos" element={<ProtectedRoute adminOnly={true}><ManagePromoCodes /></ProtectedRoute>} />

                {/* ✅ Kitchen Staff-Only Route */}
                <Route path="/kitchen" element={<ProtectedRoute kitchenOnly={true}><KitchenView /></ProtectedRoute>} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
};

// ✅ Ensure ReactDOM renders correctly
ReactDOM.createRoot(document.getElementById("root")).render(<MainApp />);
