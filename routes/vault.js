const express = require("express");
const { getData } = require("../controllers/vault");
const isAuth = require("../middlewares/is-auth");

const router = express.Router();

router.get("/getData", isAuth, getData);

module.exports = router;
