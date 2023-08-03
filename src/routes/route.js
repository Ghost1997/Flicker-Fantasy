const express = require("express");
const router = express.Router();
const { savePicture } = require("../controllers/pictureController");
const { homePage } = require("../controllers/homeController");

router.post("/pictures", savePicture);
router.get("/", homePage);

module.exports = router;
