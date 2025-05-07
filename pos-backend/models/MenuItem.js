const mongoose = require("mongoose");

const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ["Appetizers", "Drinks", "Main Course"], required: true },
  price: { type: Number, required: true },
  description: { type: String },
  stock: { type: Number, default: 10 }, // ✅ Added stock tracking
});

module.exports = mongoose.model("MenuItem", MenuItemSchema);
