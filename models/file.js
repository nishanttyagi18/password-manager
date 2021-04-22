const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const fileSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  vault: {
    type: Schema.Types.ObjectId,
    ref: "Vault",
    required: true,
  },
});

module.exports = mongoose.model("File", fileSchema);
