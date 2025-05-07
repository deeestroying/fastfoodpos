import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const { user, logout } = useAuth();
  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      console.log("🔄 Fetching user profile...");

      const res = await axios.get(
        "http://localhost:5000/api/users/profile",
        { headers: { Authorization: `Bearer ${user.token}` } } // ✅ Ensure token is sent
      );

      console.log("✅ User profile fetched:", res.data);
      setName(res.data.name);
    } catch (error) {
      console.error("❌ Error fetching profile:", error.response?.data || error.message);
    }
  };

  const updateName = async () => {
    if (!name.trim()) {
      alert("Name cannot be empty!");
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        "http://localhost:5000/api/users/profile/update-name",
        { name },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert("✅ Name updated successfully!");
    } catch (error) {
      console.error("❌ Error updating name:", error);
      alert("Error updating name!");
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async () => {
    if (!currentPassword || !newPassword) {
      alert("Please fill in both password fields.");
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        "http://localhost:5000/api/users/profile/change-password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert("✅ Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      console.error("❌ Error changing password:", error);
      alert("Error changing password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">👤 User Profile</h2>

      {/* Name Update */}
      <div className="mb-4">
        <label className="block font-semibold">Full Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <button
          onClick={updateName}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Name"}
        </button>
      </div>

      {/* Password Change */}
      <div className="mb-4">
        <label className="block font-semibold">Current Password:</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <label className="block font-semibold mt-2">New Password:</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <button
          onClick={changePassword}
          className="mt-2 bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Updating..." : "Change Password"}
        </button>
      </div>

      {/* Logout & Switch Account */}
      <button
        onClick={() => {
          logout();
          navigate("/login");
        }}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded w-full hover:bg-red-600"
      >
        Logout & Switch Account
      </button>
    </div>
  );
}
