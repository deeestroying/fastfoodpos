import { useState, useEffect } from "react";
import axios from "axios";

export default function StaffManagement() {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/staff");
      setStaff(res.data);
    } catch (error) {
      console.error("❌ Error fetching staff:", error);
    }
  };

  const updateRole = async (id, role) => {
    try {
      await axios.put(`http://localhost:5000/api/users/update-role/${id}`, { role });
      fetchStaff();
    } catch (error) {
      console.error("❌ Error updating role:", error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      fetchStaff();
    } catch (error) {
      console.error("❌ Error deleting staff:", error);
    }
  };

  return (
    <div className="p-6 mt-16">
      <h2 className="text-2xl font-bold mb-4">👥 Staff Management</h2>

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
          {staff.map((user) => (
            <tr key={user._id} className="border">
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">
                <select
                  value={user.role}
                  onChange={(e) => updateRole(user._id, e.target.value)}
                  className="border p-1 rounded"
                >
                  <option value="admin">Admin</option>
                  <option value="cashier">Cashier</option>
                  <option value="kitchen">Kitchen Staff</option>
                </select>
              </td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => deleteUser(user._id)}
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
