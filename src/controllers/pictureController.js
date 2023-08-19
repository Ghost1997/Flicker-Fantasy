const Picture = require("../models/pictureModel");
const path = require("path");
const fs = require("fs");

const savePicture = async (req, res) => {
  try {
    const { type } = req.body;
    const photos = req.files.map((file) => {
      return {
        type,
        url: file.path.replace("content", ""),
      };
    });
    const savedPictures = await Picture.insertMany(photos);
    res.status(201).json({ success: true, savedPictures });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error saving pictures to the database." });
  }
};

const deletePictures = async (req, res) => {
  try {
    const photoId = req.body.id;
    const photo = await Picture.findById(photoId);
    if (!photo) {
      return res.status(404).json({ message: "Photo not found" });
    }
    fs.unlinkSync(path.join("./content", photo.url));
    await Picture.findByIdAndDelete(photoId);

    res.json({ success: true, message: "Photo deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const galleryPage = async (req, res) => {
  try {
    const whatsApp = process.env.BUSINESS_NUMBER;
    const count = process.env.GALLERY_COUNT;
    const images = await Picture.find({ type: "gallery" }).sort({ createdDate: -1 }).limit(count);

    res.render("gallery", { whatsApp, images });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getAllImages = async (req, res) => {
  try {
    const images = await Picture.find({ type: "gallery" }).sort({ createdDate: -1 });

    res.json({ images });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { savePicture, deletePictures, galleryPage, getAllImages };
