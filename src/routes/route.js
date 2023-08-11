const express = require("express");
const router = express.Router();
const { savePicture } = require("../controllers/pictureController");
const { homePage, aboutPage, termsPage, contactPage } = require("../controllers/homeController");
const { saveTheaterInfo, getSlotInfo } = require("../controllers/theaterController");
const { confirmBooking, calculate, successBooking } = require("../controllers/bookingController");
const { saveTestimonial } = require("../controllers/testimonialController");

router.post("/pictures", savePicture);
router.post("/theater/saveInfo", saveTheaterInfo);
router.post("/theater/getSlotInfo", getSlotInfo);
router.post("/booking/bookTheater", confirmBooking);
router.post("/testimonial/save", saveTestimonial);
router.get("/", homePage);
router.get("/about", aboutPage);
router.get("/terms", termsPage);
router.post("/calculate", calculate);
router.get("/booking/success", successBooking);
router.get("/contact", contactPage);

module.exports = router;
