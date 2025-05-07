import { useState, useEffect } from "react";
import axios from "axios";

export default function CustomerManagement() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/customers");
      setCustomers(res.data);
    } catch (error) {
      console.error("❌ Error fetching customers", error);
    }
  };

  return (
    <div className="p-6 mt-16">
      <h2 className="text-2xl font-bold mb-4">👥 Customer Management</h2>

      <table className="w-full border-collapse border border-gray-300 shadow-lg">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Contact</th>
            <th className="border p-2">Total Orders</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer._id} className="border hover:bg-gray-100">
              <td className="border p-2">{customer.name}</td>
              <td className="border p-2">{customer.contact}</td>
              <td className="border p-2">{customer.orderHistory.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
