const express = require("express");
const PromoCode = require("../models/PromoCode");
const router = express.Router();

// ✅ Apply Promo Code (Validate & Return Discount)
router.post("/apply", async (req, res) => {
  const { code } = req.body;

  try {
    const promo = await PromoCode.findOne({ code, isActive: true });

    if (!promo) return res.status(400).json({ error: "Invalid or expired promo code." });

    if (new Date() > promo.validUntil) {
      return res.status(400).json({ error: "This promo code has expired." });
    }

    res.json({ discount: promo.discountPercentage });
  } catch (err) {
    console.error("Error applying promo code:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Admin: Create a New Promo Code
router.post("/create", async (req, res) => {
  const { code, discountPercentage, validUntil } = req.body;

  try {
    const newPromo = new PromoCode({ code, discountPercentage, validUntil });
    await newPromo.save();
    res.status(201).json({ message: "Promo code created successfully!", promo: newPromo });
  } catch (err) {
    console.error("Error creating promo code:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Edit Promo Code
router.put("/:id", async (req, res) => {
    try {
      const updatedPromo = await PromoCode.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json({ message: "Promo code updated successfully!", promo: updatedPromo });
    } catch (err) {
      res.status(500).json({ error: "Server error updating promo code" });
    }
  });
  
  // ✅ Delete Promo Code
  router.delete("/:id", async (req, res) => {
    try {
      await PromoCode.findByIdAndDelete(req.params.id);
      res.json({ message: "Promo code deleted successfully!" });
    } catch (err) {
      res.status(500).json({ error: "Server error deleting promo code" });
    }
  });

// ✅ Admin: Get All Promo Codes
router.get("/", async (req, res) => {
  try {
    const promos = await PromoCode.find();
    res.json(promos);
  } catch (err) {
    console.error("Error fetching promo codes:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
