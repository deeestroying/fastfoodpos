const mongoose = require("mongoose");

const PromoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // Example: "WELCOME10"
  discountPercentage: { type: Number, required: true }, // Example: 10 for 10% off
  validUntil: { type: Date, required: true }, // Expiry date
  isActive: { type: Boolean, default: true }, // Can be disabled if needed
});

module.exports = mongoose.model("PromoCode", PromoCodeSchema);
