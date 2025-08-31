const { body, validationResult } = require("express-validator");

// Product validation rules
const validateProduct = [
  body("name")
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 2 })
    .withMessage("Product name must be at least 2 characters"),
  body("price")
    .isNumeric()
    .withMessage("Price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Price must be positive"),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a positive integer"),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
];

// User validation rules
const validateUser = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

// Order validation rules
const validateOrder = [
  body("products")
    .isArray({ min: 1 })
    .withMessage("At least one product is required"),
  body("products.*.productId").isMongoId().withMessage("Invalid product ID"),
  body("products.*.qty")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
];

// Check validation results
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

module.exports = {
  validateProduct,
  validateUser,
  validateOrder,
  checkValidation,
};
