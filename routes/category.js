const express = require("express");
const router = express.Router();

const { check, validationResult } = require("express-validator");

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

const {
  getCategoryById,
  createCategory,
  getCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");

// Params
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

// Create
router.post(
  "/category/create/:userId",
  [
    check("name")
      .isLength({ min: 1 })
      .trim()
      .escape()
      .withMessage("Name should aleast 1 character long"),
  ],
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createCategory
);

// Read
router.get("/category/:categoryId", getCategory);
router.get("/categories", getAllCategories);

// Update
router.put(
  "/category/update/:categoryId/:userId",
  [
    check("name")
      .isLength({ min: 1 })
      .trim()
      .escape()
      .withMessage("Name should aleast 1 character long"),
  ],
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateCategory
);

// Delete
router.delete(
  "/category/delete/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteCategory
);

module.exports = router;
