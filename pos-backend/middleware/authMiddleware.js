const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1]; // Extract token
    if (!token) return res.status(401).json({ error: "Access Denied. No Token Provided." });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    
    if (!req.user) return res.status(401).json({ error: "User not found" });

    next(); // Proceed to the next middleware
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
