import { useState, useEffect } from "react";
import axios from "axios";

export default function RefundRequests() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchRefundRequests();
  }, []);

  const fetchRefundRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reports/refund-requests");
      setOrders(res.data);
    } catch (error) {
      console.error("❌ Error fetching refund requests", error);
    }
  };

  const approveRefund = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/approve-refund/${id}`);
      alert("✅ Refund approved. Inventory restocked.");
      fetchRefundRequests();
    } catch (error) {
      console.error("❌ Error approving refund", error);
    }
  };

  return (
    <div className="p-6 mt-16">
      <h2 className="text-2xl font-bold mb-4">🔄 Refund Requests</h2>

      {orders.length === 0 ? (
        <p>No refund requests pending.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Order ID</th>
              <th className="border p-2">Items</th>
              <th className="border p-2">Total</th>
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
                <td className="border p-2">
                  <button
                    onClick={() => approveRefund(order._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    ✅ Approve Refund
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
