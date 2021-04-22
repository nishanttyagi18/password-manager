const express = require("express");
const { body } = require("express-validator");
const isAuth = require("../middlewares/is-auth");
const {
  getPasswords,
  addPassword,
  updatePassword,
  getPasswordByWebsite,
  getPasswordById,
} = require("../controllers/password");

const router = express.Router();

router.get("/password", isAuth, getPasswords);

router.post(
  "/password",
  isAuth,
  [
    body("url").isURL().not().isEmpty(),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid Email")
      .normalizeEmail()
      .not()
      .isEmpty(),
    body("password").trim().isLength({ min: 5 }),
  ],
  addPassword
);

router.get("/password/website", isAuth, getPasswordByWebsite);

router.get("/password/:passId", isAuth, getPasswordById);

router.put(
  "/password/:passId",
  [
    body("url").isURL().not().isEmpty(),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid Email")
      .normalizeEmail()
      .not()
      .isEmpty(),
    body("password").trim().isLength({ min: 5 }),
  ],
  isAuth,
  updatePassword
);

module.exports = router;
