const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  id: Number,
  value: String,
});

const theaterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slots: [slotSchema],
  createdDate: { type: Date, default: Date.now },
});

const Theater = mongoose.model("Theater", theaterSchema);

module.exports = Theater;
