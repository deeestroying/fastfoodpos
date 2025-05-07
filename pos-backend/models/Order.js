const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  tableNumber: { type: Number, default: null },
  orderType: { type: String, enum: ["Dine-In", "Takeout", "Online"], required: true },
  items: [
    {
      name: String,
      quantity: Number,
      price: Number,
    },
  ],
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ["cash", "card"], required: true },
  status: { type: String, enum: ["Pending", "In-Progress", "Completed", "Cancelled"], default: "Pending" },
  refundRequested: { type: Boolean, default: false },
  refundApproved: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
