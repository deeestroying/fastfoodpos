import { useState, useEffect } from "react";
import axios from "axios";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reports/order-history");
      setOrders(res.data);
    } catch (error) {
      console.error("❌ Error fetching order history", error);
    }
  };

  const cancelOrder = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/cancel/${id}`);
      alert("Order cancelled. Awaiting refund approval.");
      fetchOrderHistory();
    } catch (error) {
      console.error("❌ Error cancelling order", error);
    }
  };

  return (
    <div className="p-6 mt-16">
      <h2 className="text-2xl font-bold mb-4">📜 Order History</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Order ID</th>
              <th className="border p-2">Items</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border">
                <td className="border p-2">{order._id}</td>
                <td className="border p-2">
                  {order.items.map((item) => `${item.name} x${item.quantity}`).join(", ")}
                </td>
                <td className="border p-2">${order.total.toFixed(2)}</td>
                <td className="border p-2 font-bold">
                  <span
                    className={`px-2 py-1 rounded ${
                      order.status === "Completed"
                        ? "bg-green-500 text-white"
                        : order.status === "Cancelled"
                        ? "bg-red-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="border p-2">
                  {order.status !== "Completed" && order.status !== "Cancelled" && (
                    <button
                      onClick={() => cancelOrder(order._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Cancel Order
                    </button>
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
