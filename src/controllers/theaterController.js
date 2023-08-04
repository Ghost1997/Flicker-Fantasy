const Theater = require("../models/theaterModel");

const saveTheaterInfo = async (req, res) => {
  try {
    const { data } = req.body;
    const saveTheaters = await Theater.insertMany(data);
    res.status(201).json(saveTheaters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating theater" });
  }
};

module.exports = { saveTheaterInfo };
