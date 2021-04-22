const express = require("express");
const { body } = require("express-validator");
const isAuth = require("../middlewares/is-auth");
const {
  getCards,
  addCard,
  updateCard,
  getCardByType,
  getCardById,
} = require("../controllers/card");

const router = express.Router();

router.get("/card", isAuth, getCards);

router.post(
  "/card",
  [
    body("nameOnCard")
      .trim()
      .isLength({ min: 3 })
      .blacklist("$#@^&!()*1234567890")
      .not()
      .isEmpty(),
    body("typeOfCard")
      .trim()
      .isLength({ min: 3 })
      .blacklist("$#@^&!()*1234567890")
      .not()
      .isEmpty(),
    body("number").isCreditCard(),
    body("cvv").isLength({ min: 3 }),
  ],
  isAuth,
  addCard
);

router.get("/card/type", isAuth, getCardByType);

router.get("/card/:cardId", isAuth, getCardById);

router.put(
  "/card/:cardId",
  [
    body("nameOnCard")
      .trim()
      .isLength({ min: 3 })
      .blacklist("$#@^&!()*1234567890")
      .not()
      .isEmpty(),
    body("typeOfCard")
      .trim()
      .isLength({ min: 3 })
      .blacklist("$#@^&!()*1234567890")
      .not()
      .isEmpty(),
    body("number").isCreditCard(),
    body("cvv").isLength({ min: 3 }),
  ],
  isAuth,
  updateCard
);

module.exports = router;
