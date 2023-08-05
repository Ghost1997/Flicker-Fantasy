const express = require("express");
const router = express.Router();
const { savePicture } = require("../controllers/pictureController");
const { homePage } = require("../controllers/homeController");
const { saveTheaterInfo, getSlotInfo } = require("../controllers/theaterController");
const { bookTheater } = require("../controllers/bookingController");
const { saveTestimonial } = require("../controllers/testimonialController");

router.post("/pictures", savePicture);
router.post("/theater/saveInfo", saveTheaterInfo);
router.post("/theater/getSlotInfo", getSlotInfo);
router.post("/booking/bookTheater", bookTheater);
router.post("/testimonial/save", saveTestimonial);
router.get("/", homePage);

module.exports = router;
