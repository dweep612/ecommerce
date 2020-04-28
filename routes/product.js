const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");

const { getUserById } = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

const {
  getProductById,
  createProduct,
  getProduct,
  getPhoto,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getAllUniqueCategories,
} = require("../controllers/product");

// Params
router.param("userId", getUserById);
router.param("productId", getProductById);

// Routes

// Create
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);

// Read
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", getPhoto);

// Update
router.put(
  "/product/update/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);

// Delete
router.delete(
  "/product/delete/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteProduct
);

// Listing
router.get("/products", getAllProducts);

router.get("/products/categories", getAllUniqueCategories);

module.exports = router;
