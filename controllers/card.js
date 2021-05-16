const { validationResult } = require("express-validator");

const Card = require("../models/card");
const Vault = require("../models/vault");
const { encrypt, decrypt } = require("../utils/encrypt-decrypt");
const { throwError } = require("../utils/catch-error");
const mongoose = require("mongoose");

// getting all the cards
exports.getCards = async (req, res, next) => {
  try {
    const storedCards = await Card.find({
      vault: req.vaultId,
    });
    console.log(storedCards);
    if (storedCards) {
      storedCards.forEach((element) => {
        element.number = decrypt(element.number);
        element.cvv = decrypt(element.cvv);
        element.expiry = decrypt(element.expiry);
      });
      res.status(200).json(storedCards);
    }
  } catch (error) {
    throwError(error, next);
  }
};

// Adding new card
exports.addCard = async (req, res, next) => {
  // Handling validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }

  const nameOnCard = req.body.nameOnCard;
  const number = encrypt(req.body.number);
  const cvv = encrypt(req.body.cvv);
  const typeOfCard = req.body.typeOfCard;
  const expiry = encrypt(req.body.expiry);
  const vault = req.vaultId;

  try {
    const myCard = new Card({
      nameOnCard,
      number,
      cvv,
      typeOfCard,
      expiry,
      vault,
    });
    const savedCard = await myCard.save();

    if (savedCard) {
      res.status(201).json({
        message: "Card Added successfully!",
        savedCard,
      });
    }
  } catch (error) {
    throwError(error, next);
  }
};

// Updating card with ID
exports.updateCard = async (req, res, next) => {
  // Handling validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }

  const cardId = req.params.cardId;

  const nameOnCard = req.body.name;
  const number = req.body.number;
  const cvv = req.body.cvv;
  const typeOfCard = req.body.type;
  const expiry = req.body.expiry;

  for (let [key] of Object.entries(req.body)) {
    if (key !== "nameOnCard" && key !== "typeOfCard") {
      req.body[key] = encrypt(req.body[key]);
    } else {
      req.body[key] = req.body[key];
    }
  }
  try {
    const savedCard = await Card.findOneAndUpdate({ _id: cardId }, req.body, {
      upsert: true,
      new: true,
    });

    if (savedCard) {
      res.status(201).json({
        message: "Card Updated successfully!",
        savedCard,
      });
    }
  } catch (error) {
    throwError(error, next);
  }
};

// Getting Card by Type
exports.getCardByType = async (req, res, next) => {
  const typeOfCard = req.body.type;
  try {
    const savedCard = await Card.find({
      typeOfCard: typeOfCard,
      vault: req.vaultId,
    });

    if (savedCard) {
      res.status(200).json(savedCard);
    }
  } catch (error) {
    throwError(error, next);
  }
};

// Getting Card by ID
exports.getCardById = async (req, res, next) => {
  const cardId = req.params.cardId;

  try {
    const savedCard = await Card.findOne({
      _id: cardId,
    });

    if (savedCard) {
      // console.log(savedCard);
      savedCard.number = decrypt(savedCard.number);
      savedCard.cvv = decrypt(savedCard.cvv);
      savedCard.expiry = decrypt(savedCard.expiry);
      res.status(200).json(savedCard);
    }
  } catch (error) {
    throwError(error, next);
  }
};
