const express = require("express");
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

router.post("/password", isAuth, addPassword);

router.get("/password/website", isAuth, getPasswordByWebsite);

router.get("/password/:passId", isAuth, getPasswordById);

router.put("/password/:passId", isAuth, updatePassword);

module.exports = router;
