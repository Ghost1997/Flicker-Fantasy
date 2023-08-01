const mongoose = require("mongoose");

const exampleSchema = new mongoose.Schema({
  // Define your schema fields here
  name: { type: String, required: true },
  age: { type: Number, required: true },
});

const Example = mongoose.model("Example", exampleSchema);

module.exports = Example;
