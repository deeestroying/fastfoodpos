const express = require("express");
const MenuItem = require("../models/MenuItem");
const router = express.Router();

// ✅ Deduct stock when an order is placed (Fix for ObjectId issue)
router.put("/reduce-stock", async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error("❌ No valid items provided in stock reduction request.");
      return res.status(400).json({ error: "No valid items provided" });
    }

    for (const item of items) {
      if (!item._id || !item.quantity) {
        console.error("❌ Missing item _id or quantity:", item);
        return res.status(400).json({ error: "Each item must have a valid _id and quantity" });
      }

      console.log(`🔍 Checking item: ${item._id}, Quantity: ${item.quantity}`);

      // Find the menu item in the database
      const menuItem = await MenuItem.findById(item._id);

      if (!menuItem) {
        console.error(`❌ Menu item not found: ${item._id}`);
        return res.status(404).json({ error: `Menu item not found for ID: ${item._id}` });
      }

      if (menuItem.stock < item.quantity) {
        console.error(`⚠ Not enough stock for ${menuItem.name}. Available: ${menuItem.stock}, Requested: ${item.quantity}`);
        return res.status(400).json({ error: `Not enough stock for ${menuItem.name}` });
      }

      // Deduct stock
      menuItem.stock -= item.quantity;
      await menuItem.save();

      console.log(`✅ Stock updated: ${menuItem.name}, New Stock: ${menuItem.stock}`);
    }

    res.json({ message: "Stock updated successfully!" });

  } catch (err) {
    console.error("❌ Server error reducing stock:", err);
    res.status(500).json({ error: "Server error reducing stock" });
  }
});

// ✅ Get all menu items
router.get("/", async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Add a new menu item (Admin only)
router.post("/", async (req, res) => {
  const { name, category, price, description, stock } = req.body;
  try {
    const newItem = new MenuItem({ name, category, price, description, stock });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update an existing menu item (Admin only)
router.put("/:id", async (req, res) => {
  const { name, category, price, description, stock } = req.body;
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, { name, category, price, description, stock }, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete a menu item (Admin only)
router.delete("/:id", async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Menu item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get low-stock items (less than 5 units left)
router.get("/low-stock", async (req, res) => {
  try {
    const lowStockItems = await MenuItem.find({ stock: { $lt: 5 } });
    res.json(lowStockItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
