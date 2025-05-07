import { useState, useEffect } from "react";
import axios from "axios";

export default function MenuManagement() {
  const [menu, setMenu] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Appetizers");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState(10);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchMenu();
    fetchLowStockItems();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/menu");
      setMenu(res.data);
    } catch (error) {
      console.error("Error fetching menu", error);
    }
  };

  const fetchLowStockItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/menu/low-stock");
      setLowStockItems(res.data);
    } catch (error) {
      console.error("Error fetching low-stock items", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const itemData = { name, category, price, description, stock };

    try {
      if (editingItem) {
        await axios.put(`http://localhost:5000/api/menu/${editingItem}`, itemData);
      } else {
        await axios.post("http://localhost:5000/api/menu", itemData);
      }
      setName("");
      setCategory("Appetizers");
      setPrice("");
      setDescription("");
      setStock(10);
      setEditingItem(null);
      fetchMenu();
      fetchLowStockItems();
    } catch (error) {
      console.error("Error saving menu item", error);
    }
  };

  const handleEdit = (item) => {
    setName(item.name);
    setCategory(item.category);
    setPrice(item.price);
    setDescription(item.description);
    setStock(item.stock);
    setEditingItem(item._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/menu/${id}`);
      fetchMenu();
      fetchLowStockItems();
    } catch (error) {
      console.error("Error deleting menu item", error);
    }
  };

  return (
    <div className="p-6 mt-16">
      <h2 className="text-2xl font-bold mb-4">Menu Management</h2>

      {/* Low-Stock Warning */}
      {lowStockItems.length > 0 && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
          <h3 className="font-semibold">⚠ Low Stock Alert!</h3>
          <ul>
            {lowStockItems.map((item) => (
              <li key={item._id}>{item.name} (Stock: {item.stock})</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <input type="text" placeholder="Item Name" value={name} onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full" required />
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded-md">
          <option value="Appetizers">Appetizers</option>
          <option value="Drinks">Drinks</option>
          <option value="Main Course">Main Course</option>
        </select>
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)}
          className="border p-2 w-full" required />
        <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full" />
        <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)}
          className="border p-2 w-full" />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingItem ? "Update Item" : "Add Item"}
        </button>
      </form>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Stock</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {menu.map((item) => (
            <tr key={item._id} className={`border ${item.stock < 5 ? "bg-red-50" : ""}`}>
              <td className="border p-2">{item.name}</td>
              <td className="border p-2">{item.category}</td>
              <td className="border p-2">${item.price.toFixed(2)}</td>
              <td className="border p-2">{item.stock}</td>
              <td className="border p-2 space-x-2">
                <button onClick={() => handleEdit(item)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                <button onClick={() => handleDelete(item._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
