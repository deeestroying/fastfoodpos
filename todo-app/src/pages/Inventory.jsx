import { useState, useEffect } from "react";
import axios from "axios";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await axios.get("http://localhost:5000/api/inventory");
    setItems(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const itemData = { name, price, stock };

    if (editingItem) {
      await axios.put(`http://localhost:5000/api/inventory/${editingItem}`, itemData);
    } else {
      await axios.post("http://localhost:5000/api/inventory", itemData);
    }

    setName("");
    setPrice("");
    setStock("");
    setEditingItem(null);
    fetchItems();
  };

  const handleEdit = (item) => {
    setName(item.name);
    setPrice(item.price);
    setStock(item.stock);
    setEditingItem(item._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/inventory/${id}`);
    fetchItems();
  };

  return (
    <div className="p-6 mt-16">
      <h2 className="text-2xl font-bold mb-4">Inventory Management</h2>

      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <input type="text" placeholder="Item Name" value={name} onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full" required />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)}
          className="border p-2 w-full" required />
        <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)}
          className="border p-2 w-full" required />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingItem ? "Update Item" : "Add Item"}
        </button>
      </form>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Stock</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id} className="border">
              <td className="border p-2">{item.name}</td>
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
