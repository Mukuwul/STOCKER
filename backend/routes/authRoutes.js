const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const {
  validateUser,
  checkValidation,
} = require("../middlewares/validationMiddleware");

const router = express.Router();

router.post("/register", validateUser, checkValidation, registerUser);
router.post("/login", loginUser);

module.exports = router;
