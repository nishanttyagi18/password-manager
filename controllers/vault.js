const Card = require("../models/card");
const Password = require("../models/password");
const { throwError } = require("../utils/catch-error");

exports.getData = async (req, res, next) => {
  try {
    const cards = await Card.find({ vault: req.vaultId });
    const passwords = await Password.find({ vault: req.vaultId });
    var vault = {};
    if (cards) {
      vault.cards = cards;
    }
    if (passwords) {
      vault.passwords = passwords;
    }

    if (vault) {
      res.status(200).json(vault);
    }
  } catch (error) {
    throwError(error, next);
  }
};
