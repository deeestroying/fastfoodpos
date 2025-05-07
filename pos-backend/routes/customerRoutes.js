const express = require("express");
const Customer = require("../models/Customer");
const Order = require("../models/Order");
const router = express.Router();

// Get all customers
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find().populate("orderHistory.orderId");
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single customer by contact number
router.get("/:contact", async (req, res) => {
  try {
    const customer = await Customer.findOne({ contact: req.params.contact }).populate("orderHistory.orderId");
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new customer (if not exists)
router.post("/", async (req, res) => {
  const { name, contact } = req.body;

  try {
    let customer = await Customer.findOne({ contact });

    if (customer) {
      return res.status(400).json({ message: "Customer already exists" });
    }

    customer = new Customer({ name, contact });
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add an order to customer's history (loyalty points)
router.put("/:contact/add-order", async (req, res) => {
  const { orderId, totalAmount } = req.body;

  try {
    let customer = await Customer.findOne({ contact: req.params.contact });

    if (!customer) return res.status(404).json({ message: "Customer not found" });

    customer.orderHistory.push({ orderId, totalAmount });
    customer.loyaltyPoints += Math.floor(totalAmount / 10); // Earn 1 point per $10 spent
    await customer.save();

    res.json({ message: "Order added to history", customer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Apply discount if customer has loyalty points
router.post("/:contact/apply-discount", async (req, res) => {
  try {
    let customer = await Customer.findOne({ contact: req.params.contact });

    if (!customer) return res.status(404).json({ message: "Customer not found" });

    let discount = customer.loyaltyPoints >= 10 ? 5 : 0; // $5 discount if 10+ points
    customer.loyaltyPoints = customer.loyaltyPoints >= 10 ? customer.loyaltyPoints - 10 : customer.loyaltyPoints;
    await customer.save();

    res.json({ discount, remainingPoints: customer.loyaltyPoints });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get customer order history (with total spent)
router.get("/:contact/history", async (req, res) => {
  try {
    const customer = await Customer.findOne({ contact: req.params.contact }).populate("orderHistory.orderId");

    if (!customer) return res.status(404).json({ message: "Customer not found" });

    res.json({
      name: customer.name,
      contact: customer.contact,
      totalSpent: customer.orderHistory.reduce((sum, order) => sum + order.totalAmount, 0),
      orders: customer.orderHistory
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
