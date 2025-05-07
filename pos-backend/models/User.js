const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ["admin", "cashier", "kitchen"], // ✅ Ensure "kitchen" is included
    default: "cashier"
  },
});

module.exports = mongoose.model("User", UserSchema);
