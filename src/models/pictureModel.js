const mongoose = require("mongoose");

const pictureSchema = new mongoose.Schema({
  url: { type: String, required: true, unique: true },
  createdDate: { type: Date, default: Date.now },
});

const Picture = mongoose.model("Picture", pictureSchema);

module.exports = Picture;
