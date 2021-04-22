const path = require("path");
const fs = require("fs");
const File = require("../models/file");
const { encryptFile, decryptFile } = require("../utils/file-encrypt-decrypt");
const { throwError } = require("../utils/catch-error");

exports.getFile = async (req, res, next) => {
  try {
    const savedfile = await File.findOne({
      _id: req.params.fileId,
      vault: req.vaultId,
    });
    if (!savedfile) {
      const error = new Error("File couldn't be found");
      error.status = 404;
      return next(error);
    }
    console.log("work");
    const isAvail = await decryptFile(
      savedfile.fileUrl,
      savedfile.fileUrl.replace("buffer", "")
    );

    if (isAvail) {
      fs.rename(
        savedfile.fileUrl.replace("buffer", ""),
        "encryptedFiles/" + savedfile.name,
        (err) => {
          if (err) console.log("ERROR: " + err);
          res.download("encryptedFiles/" + savedfile.name);
        }
      );
    }
    setTimeout(() => {
      clearImage("encryptedFiles/" + savedfile.name);
    }, 2000);
  } catch (error) {
    throwError(error, next);
  }
};

exports.uploadFile = async (req, res, next) => {
  if (!req.file) {
    const error = new Error("No File Provided.");
    error.statusCode = 422;
    return next(error);
  }
  // console.log(req.file);
  // const extension = req.file.mimetype.split("/")[1];
  try {
    const myfile = new File({
      name: req.file.originalname,
      fileUrl: req.file.path + "buffer",
      vault: req.vaultId,
    });
    const savedUrl = await myfile.save();
    const isUpload = encryptFile(req.file.path, req.file.path + "buffer");
    clearImage(req.file.path);
    res.json({ message: "file uploaded successfully", id: savedUrl._id });
  } catch (error) {
    throwError(error, next);
  }
};

exports.getFiles = async (req, res, next) => {
  try {
    const files = await File.find({ vault: req.vaultId });
    if (files) {
      res.status(200).json(files);
    }
  } catch (error) {
    throwError(error, next);
  }
};

const clearImage = (filePath) => {
  filePathToDelete = path.join(__dirname, "..", filePath);
  console.log(filePathToDelete);
  fs.unlink(filePathToDelete, (err) => {
    if (err) {
      console.log(err);
    }
  });
};
