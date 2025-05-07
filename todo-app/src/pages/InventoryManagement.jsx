import { useState, useEffect } from "react";
import axios from "axios";

export default function InventoryManagement() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/menu");
      setMenu(res.data);
    } catch (error) {
      console.error("❌ Error fetching inventory", error);
    }
  };

  return (
    <div className="p-6 mt-16">
      <h2 className="text-2xl font-bold mb-4">📦 Inventory Management</h2>

      <table className="w-full border-collapse border border-gray-300 shadow-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Item Name</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Stock</th>
          </tr>
        </thead>
        <tbody>
          {menu.map((item) => (
            <tr key={item._id} className={`border ${item.stock < 5 ? "bg-red-50" : ""} hover:bg-gray-100`}>
              <td className="border p-2">{item.name}</td>
              <td className="border p-2">{item.category}</td>
              <td className="border p-2">{item.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
