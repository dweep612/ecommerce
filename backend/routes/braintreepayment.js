const express = require("express");
const router = express.Router();
const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");
const { getToken, processPayment } = require("../controllers/braintreepayment");

router.param("userId", getUserById);

router.get("/payment/gettoken/:userId", isSignedIn, isAuthenticated, getToken);

router.post(
  "/braintreepayment/:userId",
  isSignedIn,
  isAuthenticated,
  processPayment
);

module.exports = router;
