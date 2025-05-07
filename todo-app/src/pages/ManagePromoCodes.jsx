import { useState, useEffect } from "react";
import axios from "axios";

export default function ManagePromoCodes() {
  const [promos, setPromos] = useState([]);
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [editingPromo, setEditingPromo] = useState(null);

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/promos");
      setPromos(res.data);
    } catch (error) {
      console.error("Error fetching promo codes", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const promoData = { code, discountPercentage: discount, validUntil };

    try {
      if (editingPromo) {
        await axios.put(`http://localhost:5000/api/promos/${editingPromo}`, promoData);
      } else {
        await axios.post("http://localhost:5000/api/promos/create", promoData);
      }
      setCode("");
      setDiscount("");
      setValidUntil("");
      setEditingPromo(null);
      fetchPromoCodes();
    } catch (error) {
      console.error("Error saving promo code", error);
    }
  };

  const handleEdit = (promo) => {
    setCode(promo.code);
    setDiscount(promo.discountPercentage);
    setValidUntil(promo.validUntil.split("T")[0]); // Format date for input
    setEditingPromo(promo._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/promos/${id}`);
      fetchPromoCodes();
    } catch (error) {
      console.error("Error deleting promo code", error);
    }
  };

  return (
    <div className="p-6 mt-16">
      <h2 className="text-2xl font-bold mb-4">Manage Promo Codes</h2>

      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <input type="text" placeholder="Promo Code" value={code} onChange={(e) => setCode(e.target.value)}
          className="border p-2 w-full" required />
        <input type="number" placeholder="Discount (%)" value={discount} onChange={(e) => setDiscount(e.target.value)}
          className="border p-2 w-full" required />
        <input type="date" placeholder="Valid Until" value={validUntil} onChange={(e) => setValidUntil(e.target.value)}
          className="border p-2 w-full" required />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingPromo ? "Update Promo Code" : "Add Promo Code"}
        </button>
      </form>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Code</th>
            <th className="border p-2">Discount (%)</th>
            <th className="border p-2">Valid Until</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {promos.map((promo) => (
            <tr key={promo._id} className="border">
              <td className="border p-2">{promo.code}</td>
              <td className="border p-2">{promo.discountPercentage}%</td>
              <td className="border p-2">{new Date(promo.validUntil).toLocaleDateString()}</td>
              <td className="border p-2 space-x-2">
                <button onClick={() => handleEdit(promo)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                <button onClick={() => handleDelete(promo._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
