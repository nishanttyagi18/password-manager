const express = require("express");
const { getFile, uploadFile, getFiles } = require("../controllers/file");
const isAuth = require("../middlewares/is-auth");

const router = express.Router();

router.get("/file/:fileId", isAuth, getFile);
router.get("/files", isAuth, getFiles);
router.post("/file", isAuth, uploadFile);

module.exports = router;
