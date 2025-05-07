const express = require("express");
const Item = require("../models/Item");
const router = express.Router();

// Get all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new item (Admin only)
router.post("/", async (req, res) => {
  const { name, price, stock } = req.body;
  try {
    const newItem = new Item({ name, price, stock });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update an item (Admin only)
router.put("/:id", async (req, res) => {
  const { name, price, stock } = req.body;
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, { name, price, stock }, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete an item (Admin only)
router.delete("/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
