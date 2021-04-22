const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passwordSchema = new Schema({
  websiteName: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  vault: {
    type: Schema.Types.ObjectId,
    ref: "Vault",
    required: true,
  },
});

module.exports = mongoose.model("Password", passwordSchema);
