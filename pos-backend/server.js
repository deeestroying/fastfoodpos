require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const menuRoutes = require("./routes/menuRoutes"); // ✅ Ensure this file exists
const customerRoutes = require("./routes/customerRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const reportRoutes = require("./routes/reportRoutes");
const userRoutes = require("./routes/userRoutes");
const promoRoutes = require("./routes/promoRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));



app.use("/api/menu/reduce-stock", menuRoutes);
  // API Routes
app.use("/api/auth", authRoutes); // User Authentication
app.use("/api/orders", orderRoutes); // Order Management
app.use("/api/menu", menuRoutes); // ✅ Menu Management
app.use("/api/customers", customerRoutes);
app.use("/api/inventory", inventoryRoutes); // Inventory Tracking
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);
app.use("/api/promos", promoRoutes);

// Default Route
app.get("/", (req, res) => res.send("🍽️ POS API is running!"));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
