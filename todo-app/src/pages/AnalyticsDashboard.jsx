import { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto"; // Ensure chart.js is imported

export default function AnalyticsDashboard() {
  const [dailySales, setDailySales] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [topItems, setTopItems] = useState([]);

  useEffect(() => {
    fetchSalesData();
    fetchTopItems();
  }, []);

  const fetchSalesData = async () => {
    try {
      const dailyRes = await axios.get("http://localhost:5000/api/reports/daily-sales");
      setDailySales(dailyRes.data);

      const monthlyRes = await axios.get("http://localhost:5000/api/reports/monthly-sales");
      setMonthlySales(monthlyRes.data);
    } catch (error) {
      console.error("❌ Error fetching sales data", error);
    }
  };

  const fetchTopItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reports/top-items");
      setTopItems(res.data);
    } catch (error) {
      console.error("❌ Error fetching top items", error);
    }
  };

  return (
    <div className="p-6 mt-16">
      <h2 className="text-2xl font-bold mb-4">📊 Sales Analytics</h2>

      {/* Daily Sales Chart */}
      <div className="mb-6 p-4 bg-white shadow-lg rounded-lg">
        <h3 className="text-xl font-semibold">📅 Daily Sales Report</h3>
        <Bar
          data={{
            labels: dailySales.map((data) => data._id),
            datasets: [
              {
                label: "Total Sales ($)",
                data: dailySales.map((data) => data.totalSales),
                backgroundColor: "rgba(54, 162, 235, 0.6)",
              },
            ],
          }}
        />
      </div>

      {/* Monthly Sales Chart */}
      <div className="mb-6 p-4 bg-white shadow-lg rounded-lg">
        <h3 className="text-xl font-semibold">📆 Monthly Sales Report</h3>
        <Line
          data={{
            labels: monthlySales.map((data) => data._id),
            datasets: [
              {
                label: "Total Sales ($)",
                data: monthlySales.map((data) => data.totalSales),
                borderColor: "rgba(75, 192, 192, 1)",
                fill: false,
              },
            ],
          }}
        />
      </div>

      {/* Top-Selling Items */}
      <div className="mb-6 p-4 bg-white shadow-lg rounded-lg">
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
