import { useState, useEffect } from "react";
import axios from "axios";

export default function SalesReport() {
  const [dailySales, setDailySales] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [topItems, setTopItems] = useState([]);

  useEffect(() => {
    fetchSalesReport();
    fetchOrderHistory();
    fetchTopItems();
  }, []);

  const fetchSalesReport = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reports/daily-sales");
      setDailySales(res.data);
    } catch (error) {
      console.error("Error fetching sales report", error);
    }
  };

  const fetchOrderHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reports/order-history");
      setOrderHistory(res.data);
    } catch (error) {
      console.error("Error fetching order history", error);
    }
  };

  const fetchTopItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reports/top-items");
      setTopItems(res.data);
    } catch (error) {
      console.error("Error fetching top items", error);
    }
  };

  return (
    <div className="p-6 mt-16">
      <h2 className="text-2xl font-bold mb-4">Sales Report & Analytics</h2>

      {/* Daily Sales Report */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">📅 Daily Sales Report</h3>
        <table className="w-full border-collapse border border-gray-300 mt-2">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Date</th>
              <th className="border p-2">Total Sales ($)</th>
              <th className="border p-2">Total Orders</th>
            </tr>
          </thead>
          <tbody>
            {dailySales.map((day, index) => (
              <tr key={index} className="border">
                <td className="border p-2">{day._id}</td>
                <td className="border p-2">${day.totalSales.toFixed(2)}</td>
                <td className="border p-2">{day.orderCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Order History */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">📜 Order History</h3>
        <table className="w-full border-collapse border border-gray-300 mt-2">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Date</th>
              <th className="border p-2">Total Amount ($)</th>
              <th className="border p-2">Items Ordered</th>
            </tr>
          </thead>
          <tbody>
            {orderHistory.map((order, index) => (
              <tr key={index} className="border">
                <td className="border p-2">{new Date(order.createdAt).toLocaleString()}</td>
                <td className="border p-2">${order.total.toFixed(2)}</td>
                <td className="border p-2">
                  {order.items.map((item) => `${item.name} x${item.quantity}`).join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Top-Selling Items */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">🔥 Top-Selling Items</h3>
        <table className="w-full border-collapse border border-gray-300 mt-2">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Item Name</th>
              <th className="border p-2">Total Sold</th>
            </tr>
          </thead>
          <tbody>
            {topItems.map((item, index) => (
              <tr key={index} className="border">
                <td className="border p-2">{item._id}</td>
                <td className="border p-2">{item.totalSold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
