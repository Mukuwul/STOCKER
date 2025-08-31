const express = require("express");
const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

// Customer Routes
router.post("/", protect, authorize(["customer"]), placeOrder);
router.get("/my-orders", protect, authorize(["customer"]), getMyOrders);

// Admin Routes
router.get("/all", protect, authorize(["admin"]), getAllOrders);
router.put("/:id/status", protect, authorize(["admin"]), updateOrderStatus);

module.exports = router;
