import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="flex">
      {/* Sidebar stays fixed on all pages */}
      <Sidebar />

      <div className="flex-1 min-h-screen bg-gray-100">
        {/* Navbar appears on all pages */}
        <Navbar />

        {/* Page Content (Will render current route) */}
        <div className="p-6 pt-16">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
