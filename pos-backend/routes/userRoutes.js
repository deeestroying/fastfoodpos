const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// ✅ Get All Users (Admin Only)
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // Exclude passwords
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Error fetching users" });
  }
});

// ✅ Update User Role (Admin Only)
router.put("/update-role/:id", async (req, res) => {
  const { role } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    res.json({ message: "User role updated!", user: updatedUser });
  } catch (err) {
    console.error("Error updating role:", err);
    res.status(500).json({ error: "Error updating user role" });
  }
});

// ✅ Reset User Password (Admin Only)
router.put("/reset-password/:id", async (req, res) => {
  const { newPassword } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.params.id, { password: hashedPassword });
    res.json({ message: "Password reset successfully!" });
  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).json({ error: "Error resetting password" });
  }
});

// ✅ Admin Creates a New User
router.post("/create", async (req, res) => {
    const { name, email, password, role } = req.body;
  
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "Email is already in use" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword, role });
      await newUser.save();
  
      res.status(201).json({ message: "User created successfully!", user: newUser });
    } catch (err) {
      console.error("Error creating user:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  // ✅ Get Current User Profile
router.get("/profile", authMiddleware, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) return res.status(404).json({ error: "User not found" });
      res.json(user);
    } catch (err) {
      console.error("Error fetching user profile:", err);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  // ✅ Update Name
  router.put("/profile/update-name", authMiddleware, async (req, res) => {
    try {
      const { name } = req.body;
      const updatedUser = await User.findByIdAndUpdate(req.user.id, { name }, { new: true }).select("-password");
      res.json({ message: "Name updated successfully!", user: updatedUser });
    } catch (err) {
      console.error("Error updating name:", err);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  // ✅ Change Password
  router.put("/profile/change-password", authMiddleware, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user.id);
  
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ error: "Incorrect current password" });
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
  
      res.json({ message: "Password updated successfully!" });
    } catch (err) {
      console.error("Error changing password:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

module.exports = router;
