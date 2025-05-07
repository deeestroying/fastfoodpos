import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen mt-16 flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Restaurant POS</h1>
        <p className="text-gray-600 mb-6">Efficient and easy-to-use POS system for restaurants.</p>
        
        <div className="flex gap-4">
          <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
            Login
          </Link>
          <Link to="/register" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
