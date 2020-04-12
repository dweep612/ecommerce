const express = require("express");
const router = express.Router();

const { check, validationResult } = require("express-validator");

const { signup, signin, signout } = require("../controllers/auth");

router.post(
  "/signup",
  [
    check("name")
      .isLength({ min: 2 })
      .trim()
      .escape()
      .withMessage("Name should aleast 2 character long"),
    check("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email please!"),
    check("password")
      .isLength({ min: 5 })
      .withMessage("Password must be of atleast 5 character long"),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("email").isEmail().withMessage("Valid email please"),
    check("password").isLength({ min: 1 }).withMessage("Password is required"),
  ],
  signin
);

router.get("/signout", signout);

module.exports = router;
