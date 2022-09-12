const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const staffAuthController = require("../controllers/staffAuthController");

// route at the end https://localhost/auth/customer
router.post("/customer", authController.handleLogin);
router.post("/staff", staffAuthController.handleLogin);

module.exports = router;
