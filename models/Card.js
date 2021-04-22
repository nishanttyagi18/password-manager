const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CardSchema = new Schema({
  nameOnCard: {
    type: String,
    required: true,
  },
  typeOfCard: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  cvv: {
    type: String,
    required: true,
  },
  expiry: {
    type: String,
    required: true,
  },
  vault: {
    type: Schema.Types.ObjectId,
    ref: "Vault",
    required: true,
  },
});

module.exports = mongoose.model("Card", CardSchema);
