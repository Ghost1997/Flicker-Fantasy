// models/Addon.js

const mongoose = require("mongoose");

const addonSchema = new mongoose.Schema({
  addons: [
    {
      title: {
        type: String,
        required: true,
      },
      items: [
        {
          name: {
            type: String,
            required: true,
          },
          image: {
            type: String,
            required: true,
          },
          price: {
            type: Number,
            required: true,
          },
        },
      ],
    },
  ],
});

const Addon = mongoose.model("Addon", addonSchema);

module.exports = Addon;
