const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Vault = require("../models/vault");
const { throwError } = require("../utils/catch-error");

// Signup Controller
exports.signup = async (req, res, next) => {
  const fullName = req.body.fullName;
  const email = req.body.email;
  const password = req.body.password;
  const id = mongoose.Types.ObjectId();

  try {
    // creating a vault for the new user
    const vault = new Vault({ user: id });
    const savedVault = await vault.save();

    // hashing the password
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      _id: id,
      fullName,
      email,
      password: hashedPassword,
      vault: savedVault._id,
    });
    const savedUser = await user.save();

    if (savedUser) {
      res.status(201).json({
        message: "User Created",
        userId: savedUser._id,
        vaultId: savedVault._id,
      });
    }
  } catch (error) {
    throwError(error, next);
  }
};

// Login Controller
exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    // finding user in database
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User Couldn't be found.");
      error.statusCode = 401;
      return next(error);
    }

    // checking password
    const isEqual = await bcrypt.compare(password, user.password);

    if (!isEqual) {
      const error = new Error("Incorrect Credentials.");
      error.statusCode = 401;
      return next(error);
    }

    // generating authentication token
    const token = jwt.sign(
      {
        email: email,
        userId: user._id.toString(),
        vaultId: user.vault.toString(),
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    throwError(error, next);
  }
};
