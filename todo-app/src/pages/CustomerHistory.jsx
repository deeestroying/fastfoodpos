import { useState } from "react";
import axios from "axios";

export default function CustomerHistory() {
  const [contact, setContact] = useState("");
  const [customer, setCustomer] = useState(null);

  const fetchCustomerHistory = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/customers/${contact}/history`);
      setCustomer(res.data);
    } catch (error) {
      setCustomer(null);
      console.error("Customer not found", error);
    }
  };

  return (
    <div className="p-6 mt-16">
      <h2 className="text-2xl font-bold mb-4">Customer Order History</h2>

      {/* Search Box */}
      <input
        type="text"
        placeholder="Enter phone number"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        className="w-full p-2 border rounded-md mb-2"
      />
      <button onClick={fetchCustomerHistory} className="bg-blue-500 text-white px-4 py-2 rounded">Search</button>

      {/* Customer Details */}
      {customer ? (
        <div className="mt-4 p-4 bg-white shadow rounded-lg">
          <h3 className="font-semibold text-lg">{customer.name}</h3>
          <p>Contact: {customer.contact}</p>
          <p className="font-bold">Total Spent: ${customer.totalSpent.toFixed(2)}</p>

          <h3 className="font-semibold mt-4">Order History</h3>
          {customer.orders.length === 0 ? (
            <p>No past orders.</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {customer.orders.map((order, index) => (
                <li key={index} className="p-3 bg-gray-100 rounded">
                  <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>
                  <p><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>
                  <ul className="text-sm mt-1">
                    {order.orderId.items.map((item, i) => (
                      <li key={i}>{item.name} x {item.quantity} - ${item.price.toFixed(2)}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <p className="mt-4 text-gray-500">Enter a phone number to find customer history.</p>
      )}
    </div>
  );
}
