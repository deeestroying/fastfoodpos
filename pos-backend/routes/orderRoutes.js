// Updated orderRoutes.js
const express = require("express");
const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");
const router = express.Router();

// Get all orders
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ timestamp: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new order
router.post("/", async (req, res) => {
  try {
    const { tableNumber, orderType, items, total, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Order must have at least one item" });
    }
    if (!total || total <= 0) {
      return res.status(400).json({ error: "Order total must be greater than zero" });
    }
    if (!paymentMethod) {
      return res.status(400).json({ error: "Payment method is required" });
    }

    const newOrder = new Order({
      tableNumber: orderType === "Dine-In" ? tableNumber : null,
      orderType,
      items,
      total,
      paymentMethod,
      status: "Pending",
    });

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully!", order: newOrder });
  } catch (err) {
    res.status(500).json({ error: "Server error while processing order", details: err.message });
  }
});



// Update order status
router.put("/:id/status", async (req, res) => {
  const { status } = req.body;
  if (!["Pending", "In-Progress", "Completed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Cancel Order & Request Refund (Staff Action)
router.put("/cancel/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    // ✅ Only allow cancellation if order is not completed
    if (order.status === "Completed") {
      return res.status(400).json({ error: "Cannot cancel a completed order" });
    }

    order.status = "Cancelled";
    order.refundRequested = true;
    await order.save();

    res.json({ message: "Order cancelled. Awaiting admin refund approval.", order });
  } catch (err) {
    console.error("Error cancelling order:", err);
    res.status(500).json({ error: "Error cancelling order" });
  }
});

// ✅ Approve Refund (Admin Only)
router.put("/approve-refund/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (!order.refundRequested) {
      return res.status(400).json({ error: "No refund request found for this order" });
    }

    order.refundApproved = true;
    await order.save();

    // ✅ Restock inventory items
    for (const item of order.items) {
      await MenuItem.findOneAndUpdate(
        { name: item.name },
        { $inc: { stock: item.quantity } }
      );
    }

    res.json({ message: "Refund approved. Inventory restocked.", order });
  } catch (err) {
    console.error("Error approving refund:", err);
    res.status(500).json({ error: "Error approving refund" });
  }
});

// ✅ Update Order Status (Kitchen Staff Action)
router.put("/update-status/:id", async (req, res) => {
  const { status } = req.body;
  console.log(`🔄 Received request to update order ${req.params.id} to: ${status}`);
  console.log("📡 Request Body:", req.body);

  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      console.log("❌ Order not found");
      return res.status(404).json({ error: "Order not found" });
    }

    if (!status) {
      console.log("❌ Missing status in request body");
      return res.status(400).json({ error: "Missing status field" });
    }

    order.status = status;
await order.save({ validateBeforeSave: false });


    console.log(`✅ Order ${req.params.id} updated to ${status}`);
    res.json({ message: `Order status updated to ${status}`, order });
  } catch (err) {
    console.error("❌ Server Error:", err);
    res.status(500).json({ error: "Error updating order status", details: err.message });
  }
});



module.exports = router;
