// routes/userRoutes.js
const express = require("express");
const { registerUser, loginUser } = require("../controller/usercontroller");
const router = express.Router();

// Route for user signup
router.post("/signup", registerUser);

// Route for user login
router.post("/login", loginUser);

module.exports = router;
