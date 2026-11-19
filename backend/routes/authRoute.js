const express = require("express");
const authController = require("../controller/authController");
const authenticate = require("../middleware/auth");
const { authLimiter } = require("../middleware/rate_limiter");

const router = express.Router();

router.post("/register", authLimiter, authController.register);
router.post("/login", authLimiter, authController.login);
router.get("/me", authenticate, authController.me);

module.exports = router;
