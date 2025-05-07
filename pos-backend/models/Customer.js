const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true, unique: true }, // Phone number or email
  orderHistory: [
    {
      orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
      totalAmount: Number,
      date: { type: Date, default: Date.now }
    }
  ],
  loyaltyPoints: { type: Number, default: 0 }, // For discounts
});

module.exports = mongoose.model("Customer", CustomerSchema);
