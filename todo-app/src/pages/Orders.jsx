import { useEffect, useState } from "react";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders");
      setOrders(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}/status`, { status });
      fetchOrders();
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  return (
    <div className="p-6 mt-16">
      <h2 className="text-2xl font-bold mb-4">Orders</h2>

      {loading ? <p>Loading orders...</p> : orders.length === 0 ? <p>No orders found.</p> : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Order Type</th>
              <th className="border p-2">Table</th>
              <th className="border p-2">Items</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border">
                <td className="border p-2">{order.orderType}</td>
                <td className="border p-2">{order.tableNumber ? `Table ${order.tableNumber}` : "N/A"}</td>
                <td className="border p-2">
                  {order.items.map((item) => (
                    <div key={item.name}>{item.name} x {item.quantity}</div>
                  ))}
                </td>
                <td className="border p-2">${order.total.toFixed(2)}</td>
                <td className="border p-2">{order.status}</td>
                <td className="border p-2">
                  {order.status !== "Completed" && (
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                      className="p-2 border rounded"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In-Progress">In-Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
