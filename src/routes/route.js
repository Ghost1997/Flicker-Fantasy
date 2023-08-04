const express = require("express");
const router = express.Router();
const { savePicture } = require("../controllers/pictureController");
const { homePage } = require("../controllers/homeController");
const { saveTheaterInfo } = require("../controllers/theaterController");

router.post("/pictures", savePicture);
router.post("/theater/saveInfo", saveTheaterInfo);
router.get("/", homePage);

module.exports = router;
