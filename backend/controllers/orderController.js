const Order = require("../models/Order");
const Product = require("../models/Product");
const sendEmail = require("../utils/sendEmail");

// Place Order (Customer)
const placeOrder = async (req, res) => {
  try {
    const { products } = req.body; // [{ productId, qty }]
    let total = 0;

    for (const item of products) {
      const product = await Product.findById(item.productId);
      if (!product)
        return res.status(404).json({ message: "Product not found" });
      if (product.stock < item.qty)
        return res.status(400).json({ message: "Not enough stock" });

      total += product.price * item.qty;
      product.stock -= item.qty;
      await product.save();
    }

    const order = await Order.create({
      user: req.user._id,
      products: products.map((p) => ({ product: p.productId, qty: p.qty })),
      totalAmount: total,
    });

    // Send email confirmation
    await sendEmail(
      req.user.email,
      "Order Confirmation",
      `Your order has been placed. Total: ₹${total}`,
      `<h2>Order Confirmed</h2><p>Total Amount: ₹${total}</p>`
    );

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Customer: Get My Orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("products.product", "name price")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin: Get All Orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("products.product", "name price")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin: Update Order Status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id).populate("user", "email");
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    // Send email notification
    await sendEmail(
      order.user.email,
      "Order Status Update",
      `Your order status is now: ${status}`,
      `<h2>Order Update</h2><p>Status: <b>${status}</b></p>`
    );

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
};
