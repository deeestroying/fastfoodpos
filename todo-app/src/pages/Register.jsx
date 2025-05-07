import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("cashier"); // Default to Cashier
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", { name, email, password, role });
      alert("✅ Registration successful! You can now log in.");
      navigate("/login");
    } catch (error) {
      alert("❌ Registration failed. Try again.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen mt-16 flex items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded mb-2"
          required
        />
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded mb-2"
          required
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded mb-2"
          required
        />
        
        <label className="block font-semibold">Select Role:</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 border rounded-md mb-4"
          required
        >
          <option value="cashier">Cashier</option>
          <option value="admin">Admin</option>
          <option value="kitchen">Kitchen Staff</option>
        </select>

        <button className="w-full bg-green-500 text-white py-2 rounded">Register</button>
      </form>
    </div>
  );
}
