import { useState, useEffect } from "react";
import axios from "axios";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "cashier",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (error) {
      console.error("❌ Error fetching users:", error);
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/users/create", newUser);
      alert("✅ User created successfully!");
      setNewUser({ name: "", email: "", password: "", role: "cashier" });
      fetchUsers();
    } catch (error) {
      console.error("❌ Error creating user:", error);
    }
  };

  return (
    <div className="p-6 mt-16">
      <h2 className="text-2xl font-bold mb-4">👤 User Management</h2>

      {/* ✅ Add New User Form */}
      <div className="bg-gray-100 p-4 mb-6 rounded">
        <h3 className="text-xl font-semibold mb-2">➕ Add New User</h3>
        <form onSubmit={createUser} className="space-y-2">
          <input
            type="text"
            placeholder="Full Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="border p-2 w-full rounded"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="border p-2 w-full rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            className="border p-2 w-full rounded"
            required
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          >
            <option value="cashier">Cashier</option>
            <option value="admin">Admin</option>
            <option value="kitchen">Kitchen Staff</option>
          </select>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded w-full">
            Create User
          </button>
        </form>
      </div>

      {/* ✅ User List Table */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border">
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">
                <select
                  value={user.role}
                  onChange={(e) => axios.put(`http://localhost:5000/api/users/update-role/${user._id}`, { role: e.target.value }).then(fetchUsers)}
                  className="border p-1 rounded"
                >
                  <option value="admin">Admin</option>
                  <option value="cashier">Cashier</option>
                  <option value="kitchen">Kitchen Staff</option>
                </select>
              </td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => axios.delete(`http://localhost:5000/api/users/${user._id}`).then(fetchUsers)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
