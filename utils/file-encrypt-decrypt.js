require("dotenv").config();
var fs = require("fs");

// encryption and decryption
var crypto = require("crypto"),
  algorithm = process.env.CRYPTO_ALGO,
  password = process.env.CRYPTO_SECRET;

function encrypt(buffer) {
  var cipher = crypto.createCipher(algorithm, password);
  var crypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return crypted;
}

function decrypt(buffer) {
  var decipher = crypto.createDecipher(algorithm, password);
  var dec = Buffer.concat([decipher.update(buffer), decipher.final()]);
  return dec;
}

// converting file to encrypted file
const encryptFile = (source, destination) => {
  fs.readFile(source, (err, data) => {
    if (err) {
      return console.log(err);
    }
    const encryFile = encrypt(data);
    fs.writeFile(destination, encryFile, (err) => {
      if (err) {
        return console.log(err);
      }
    });
  });
  return true;
};

// converting encrypted file to original file
const decryptFile = (source, destination) => {
  return new Promise((resolve, reject) => {
    fs.readFile(source, (err, data) => {
      if (err) {
        return console.log(err);
      }
      const encryFile = decrypt(data);
      fs.writeFile(destination, encryFile, (err) => {
        if (err) {
          console.log(err);
        }
        resolve(true);
      });
    });
  });
};

module.exports = { encryptFile, decryptFile };
