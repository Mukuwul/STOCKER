const express = require("express");
const {
  addProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById,
} = require("../controllers/productController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const {
  validateProduct,
  checkValidation,
} = require("../middlewares/validationMiddleware");

const router = express.Router();

// Public / Customers
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin Only (with validation)
router.post(
  "/",
  protect,
  authorize(["admin"]),
  validateProduct,
  checkValidation,
  addProduct
);
router.put(
  "/:id",
  protect,
  authorize(["admin"]),
  validateProduct,
  checkValidation,
  updateProduct
);
router.delete("/:id", protect, authorize(["admin"]), deleteProduct);

module.exports = router;
