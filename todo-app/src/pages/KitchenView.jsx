import { useState, useEffect } from "react";
import axios from "axios";

export default function KitchenView() {
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
      console.error("❌ Error fetching orders:", error);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/update-status/${id}`,
        { status },
        { headers: { "Content-Type": "application/json" } }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === id ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error("❌ Error updating order status:", error);
      alert("Failed to update order status!");
    }
  };

  return (
    <div className="p-6 mt-16">
      <h2 className="text-2xl font-bold mb-4">🍳 Kitchen Orders</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Order ID</th>
              <th className="border p-2">Items</th>
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
                <td className="border p-2">{order.status}</td>
                <td className="border p-2 space-x-2">
                  {order.status === "Pending" && (
                    <button
                      onClick={() => updateOrderStatus(order._id, "In-Progress")}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Start Making
                    </button>
                  )}
                  {order.status === "In-Progress" && (
                    <button
                      onClick={() => updateOrderStatus(order._id, "Completed")}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Complete Order
                    </button>
                  )}
                  {order.status === "Completed" && (
                    <span className="text-green-600 font-bold">✅ Completed</span>
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
