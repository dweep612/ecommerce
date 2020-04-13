const express = require("express");
const router = express.Router();

const {
  getUserById,
  getUser,
  getAllUsers,
  updateUser,
  userPurchaseList,
} = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

// Params
router.param("userId", getUserById);

// Read
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
// Get all Users
router.get("/users/:userId", isSignedIn, isAuthenticated, isAdmin, getAllUsers);

router.get(
  "/user/orders/:userId",
  isSignedIn,
  isAuthenticated,
  userPurchaseList
);

// Update
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);

module.exports = router;
