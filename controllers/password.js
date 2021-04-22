const Password = require("../models/password");
const Vault = require("../models/vault");
const { encrypt, decrypt } = require("../utils/encrypt-decrypt");
const { throwError } = require("../utils/catch-error");
const mongoose = require("mongoose");

// getting all the passwords
exports.getPasswords = async (req, res, next) => {
  try {
    const storedPassword = await Password.find({
      vault: req.vaultId,
    });
    console.log(storedPassword);
    if (storedPassword) {
      storedPassword.forEach((element) => {
        element.password = decrypt(element.password);
      });
      res.status(200).json(storedPassword);
    }
  } catch (error) {
    throwError(error, next);
  }
};

// Adding new password
exports.addPassword = async (req, res, next) => {
  const url = req.body.url;
  const websiteName = url.replace(/.+\/\/|www.|\..+/g, "");
  const email = req.body.email;
  const password = encrypt(req.body.password);
  const vault = req.vaultId;

  try {
    const myPassword = new Password({
      url,
      websiteName,
      email,
      password,
      vault,
    });
    const savedPassword = await myPassword.save();

    if (savedPassword) {
      res.status(201).json({
        message: "Password Added successfully!",
        savedPassword,
      });
    }
  } catch (error) {
    throwError(error, next);
  }
};

// Updating password with ID
exports.updatePassword = async (req, res, next) => {
  const passId = req.params.passId;
  const email = req.body.email;
  const websiteName = req.body.websiteName;
  const password = encrypt(req.body.password);

  try {
    const savedPassword = await Password.findOneAndUpdate(
      { _id: passId },
      { email, password },
      { upsert: true, new: true }
    );

    // if (savedPassword) {
    res.status(201).json({
      message: "Password Updated successfully!",
      savedPassword,
    });
    // }
  } catch (error) {
    throwError(error, next);
  }
};

// Getting password by Website
exports.getPasswordByWebsite = async (req, res, next) => {
  const websiteName = req.body.websiteName;
  try {
    const savedPassword = await Password.find({
      websiteName: websiteName,
      vault: req.vaultId,
    });

    if (savedPassword) {
      res.status(200).json(savedPassword);
    }
  } catch (error) {
    throwError(error, next);
  }
};

// Getting password by ID
exports.getPasswordById = async (req, res, next) => {
  const passId = req.params.passId;

  try {
    const savedPassword = await Password.find({
      _id: passId,
      vault: req.vaultId,
    });

    if (!savedPassword) {
      const error = new Error("Password couldn't be found");
      error.status = 404;
      return next(error);
    }
    res.status(200).json(savedPassword);
  } catch (error) {
    throwError(error, next);
  }
};
