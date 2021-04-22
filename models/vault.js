const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const vaultSchema = new mongoose.Schema({
  passwords: [
    {
      type: Schema.Types.ObjectId,
      ref: "Password",
    },
  ],
  creditCards: [
    {
      type: Schema.Types.ObjectId,
      ref: "Card",
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Vault", vaultSchema);
