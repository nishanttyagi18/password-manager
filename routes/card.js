const express = require("express");
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

router.post("/card", isAuth, addCard);

router.get("/card/type", isAuth, getCardByType);

router.get("/card/:cardId", isAuth, getCardById);

router.put("/card/:cardId", isAuth, updateCard);

module.exports = router;
