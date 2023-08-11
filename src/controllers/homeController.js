const Picture = require("../models/pictureModel");
const Testimonial = require("../models/testimonialModel");
const { getSlot } = require("./theaterController");
const moment = require("moment-timezone");
const { pricingInfo } = require("../utils/constants");
const homePage = async (req, res) => {
  try {
    const imageCount = process.env.IMAGE_COUNT;
    const testimonialCount = process.env.FEEDBACK_COUNT;
    const [images, testimonials] = await Promise.all([Picture.find().sort({ createdDate: -1 }).limit(imageCount), Testimonial.find().sort({ createdAt: -1 }).limit(testimonialCount)]);
    const today = moment().tz("Asia/Kolkata").format("DD/MM/YYYY");
    const imageUrlArray = images.map((ele) => ele.url);
    const [executive, standerd, couple] = await Promise.all([getSlot(0, today), getSlot(1, today), getSlot(2, today)]);
    const slotInfo = {
      0: slotAvailable(executive, today),
      1: slotAvailable(standerd, today),
      2: slotAvailable(couple, today),
    };
    const priceInfo = {
      0: pricingInfo.executive,
      1: pricingInfo.standerd,
      2: pricingInfo.couple,
    };
    const testimonialArray = testimonials.map((ele) => {
      return {
        name: ele.name,
        comment: ele.comment,
      };
    });
    res.render("home", { imageUrlArray, testimonialArray, slotInfo, priceInfo });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const aboutPage = async (req, res) => {
  try {
    res.render("about");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const termsPage = async (req, res) => {
  try {
    res.render("terms");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const contactPage = async (req, res) => {
  try {
    res.render("contact");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const slotAvailable = (data, today) => {
  let count = 0;
  data.forEach((element) => {
    if (!element.booked) count++;
  });
  return `${count} slots available on ${today}`;
};
module.exports = { homePage, aboutPage, termsPage, contactPage };
