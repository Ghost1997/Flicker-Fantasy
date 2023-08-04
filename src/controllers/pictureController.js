const Picture = require("../models/pictureModel");

const savePicture = async (req, res) => {
  try {
    const pictures = req.body; // Assuming the request body contains an array of URL objects
    const savedPictures = await Picture.insertMany(pictures);
    res.status(201).json(savedPictures);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error saving pictures to the database." });
  }
};

module.exports = { savePicture };
