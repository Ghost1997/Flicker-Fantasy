const mongoose = require("mongoose");

const pictureSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
});

const Picture = mongoose.model("Picture", pictureSchema);

module.exports = Picture;
