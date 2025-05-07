import { Link } from "react-router-dom";
import "./index.css"; // ✅ Ensure this line is present

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">🍽️ Welcome to Our POS System!</h1>
      <p className="mb-6 text-gray-700">Manage your restaurant efficiently with our easy-to-use system.</p>
      <div className="space-x-4">
        <Link to="/login" className="bg-blue-500 text-white px-6 py-2 rounded">Login</Link>
        <Link to="/register" className="bg-green-500 text-white px-6 py-2 rounded">Register</Link>
      </div>
    </div>
  );
}
