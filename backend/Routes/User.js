const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  editUser,
  getAllUsers,
} = require("../Controller/UserController");

const authMiddleware = require("../Middleware/Auth");

// Register a new user
router.post("/register", registerUser);

// Login user
router.post("/login", loginUser);

//Edit a user
router.patch("/edit/:userId", authMiddleware(["student"]), editUser);

// Get all users
router.get("/", authMiddleware(["employee"]), getAllUsers);

module.exports = router;
