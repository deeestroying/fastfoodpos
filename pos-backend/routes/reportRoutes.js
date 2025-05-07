const express = require("express");
const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");
const router = express.Router();

// ✅ Get Daily Sales Data
router.get("/daily-sales", async (req, res) => {
  try {
    const salesData = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: "$total" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(salesData);
  } catch (err) {
    console.error("Error fetching daily sales data:", err);
    res.status(500).json({ error: "Error fetching sales data" });
  }
});

// ✅ Get Top-Selling Items
router.get("/top-items", async (req, res) => {
  try {
    const topItems = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          totalSold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }, // Get top 5 items
    ]);

    res.json(topItems);
  } catch (err) {
    console.error("Error fetching top-selling items:", err);
    res.status(500).json({ error: "Error fetching top items" });
  }
});

// ✅ Get Monthly Sales Data
router.get("/monthly-sales", async (req, res) => {
  try {
    const salesData = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          totalSales: { $sum: "$total" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(salesData);
  } catch (err) {
    console.error("Error fetching monthly sales:", err);
    res.status(500).json({ error: "Error fetching monthly sales" });
  }
});

// ✅ Get Profit Report
router.get("/profit-report", async (req, res) => {
  try {
    const salesData = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalRevenue: { $sum: "$total" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    res.json(salesData);
  } catch (err) {
    console.error("Error fetching profit report:", err);
    res.status(500).json({ error: "Error fetching profit data" });
  }
});

// ✅ Get Low Stock Items
router.get("/low-stock", async (req, res) => {
  try {
    const lowStockItems = await MenuItem.find({ stock: { $lt: 5 } }); // Items with stock < 5
    res.json(lowStockItems);
  } catch (err) {
    console.error("Error fetching low-stock items:", err);
    res.status(500).json({ error: "Error fetching inventory data" });
  }
});

// ✅ Get Order History
router.get("/order-history", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // Get recent orders
    res.json(orders);
  } catch (err) {
    console.error("Error fetching order history:", err);
    res.status(500).json({ error: "Error fetching order history" });
  }
});

module.exports = router;
