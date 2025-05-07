import { useState } from "react";
import axios from "axios";

export default function CustomerSearch({ onSelectCustomer }) {
  const [contact, setContact] = useState("");
  const [customer, setCustomer] = useState(null);
  const [newCustomerName, setNewCustomerName] = useState("");

  const searchCustomer = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/customers/${contact}`);
      setCustomer(res.data);
    } catch (error) {
      setCustomer(null);
      console.error("❌ Customer not found", error);
    }
  };

  const addCustomer = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/customers", { name: newCustomerName, contact });
      setCustomer(res.data);
      setNewCustomerName("");
    } catch (error) {
      console.error("❌ Error adding customer", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Search Customer</h2>
      <input
        type="text"
        placeholder="Enter phone number"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        className="w-full p-2 border rounded-md mb-2 shadow-sm"
      />
      <button onClick={searchCustomer} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Search
      </button>

      {customer ? (
        <div className="mt-4 p-4 bg-white shadow-lg rounded">
          <h3 className="font-semibold">{customer.name}</h3>
          <p>Contact: {customer.contact}</p>
          <p>Loyalty Points: {customer.loyaltyPoints}</p>
          <button
            onClick={() => onSelectCustomer(customer)}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Select
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <h3 className="font-semibold">Customer not found</h3>
          <input
            type="text"
            placeholder="Enter name"
            value={newCustomerName}
            onChange={(e) => setNewCustomerName(e.target.value)}
            className="w-full p-2 border rounded-md mb-2 shadow-sm"
          />
          <button onClick={addCustomer} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Add New Customer
          </button>
        </div>
      )}
    </div>
  );
}
