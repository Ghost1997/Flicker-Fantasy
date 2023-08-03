const Picture = require("../models/pictureModel");

const homePage = async (req, res) => {
  try {
    const imageCount = process.env.IMAGE_COUNT;
    const images = await Picture.find().sort({ createdDate: -1 }).limit(imageCount);
    const imageUrlArray = images.map((ele) => ele.url);
    res.render("home", { imageUrlArray });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { homePage };
