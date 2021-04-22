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
  const nameOnCard = req.body.name;
  const number = encrypt(req.body.number);
  const cvv = encrypt(req.body.cvv);
  const typeOfCard = req.body.type;
  const expiry = encrypt(req.body.expiry);
  const vault = req.vaultId;

  try {
    const myCard = new Password({
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
  const cardId = req.params.cardId;

  const nameOnCard = req.body.name;
  const number = encrypt(req.body.number);
  const cvv = encrypt(req.body.cvv);
  const typeOfCard = req.body.type;
  const expiry = encrypt(req.body.expiry);

  try {
    const savedCard = await Card.findOneAndUpdate(
      { _id: cardId },
      { nameOnCard, number, cvv, typeOfCard, expiry },
      { upsert: true, new: true }
    );

    if (savedPassword) {
      res.status(201).json({
        message: "Card Updated successfully!",
        savedCard,
      });
    }
  } catch (error) {
    throwError(error, next);
  }
};

// Getting password by Website
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

// Getting password by ID
exports.getCardById = async (req, res, next) => {
  const cardId = req.params.cardId;

  try {
    const savedCard = await Card.find({
      _id: cardId,
    });

    if (savedCard) {
      res.status(200).json(savedCard);
    }
  } catch (error) {
    throwError(error, next);
  }
};
