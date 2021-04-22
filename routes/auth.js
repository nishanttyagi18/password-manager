const express = require("express");
const { body } = require("express-validator");
const { signup, login } = require("../controllers/auth");
const User = require("../models/user");
const router = express.Router();

router.post(
  "/signup",
  [
    body("fullName")
      .trim()
      .isLength({ min: 3 })
      .blacklist("$#@^&!()*1234567890")
      .not()
      .isEmpty(),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid Email")
      .custom(async (value) => {
        const user = await User.findOne({ email: value });
        if (user) {
          throw new Error("Email already exists");
        }
      })
      .normalizeEmail()
      .not()
      .isEmpty(),
    body("password").trim().isLength({ min: 5 }),
  ],
  signup
);
router.post("/login", login);

module.exports = router;
