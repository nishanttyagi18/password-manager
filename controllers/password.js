const Password = require("../models/password");
const { validationResult } = require("express-validator");
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
  // Handling validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }

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
  // Handling validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    return next(error);
  }

  const passId = req.params.passId;
  const email = req.body.email;
  const websiteName = req.body.websiteName;
  const password = encrypt(req.body.password);

  try {
    var savedPassword = "";
    if (email) {
      savedPassword = await Password.findOneAndUpdate(
        { _id: passId },
        { email, password },
        { upsert: true, new: true }
      );
    } else {
      savedPassword = await Password.findOneAndUpdate(
        { _id: passId },
        { password },
        { upsert: true, new: true }
      );
    }

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
    const savedPassword = await Password.findOne({
      _id: passId,
      vault: req.vaultId,
    });

    if (!savedPassword) {
      const error = new Error("Password couldn't be found");
      error.status = 404;
      return next(error);
    }
    // console.log(savedPassword);
    // console.log(savedPassword.password);
    savedPassword.password = decrypt(savedPassword.password);
    res.status(200).json(savedPassword);
  } catch (error) {
    throwError(error, next);
  }
};
