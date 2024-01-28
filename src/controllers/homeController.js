const Picture = require("../models/pictureModel");
const Testimonial = require("../models/testimonialModel");
const { getSlot } = require("./theaterController");
const moment = require("moment-timezone");
const { pricingInfo } = require("../utils/constants");
const homePage = async (req, res) => {
  try {
    const whatsApp = process.env.BUSINESS_NUMBER;
    const imageCount = process.env.IMAGE_COUNT;

    const images = await Picture.find({ type: "gallery" }).sort({ createdDate: -1 }).limit(imageCount);
    const today = moment().tz("Asia/Kolkata").format("DD/MM/YYYY");
    const imageUrlArray = images.map((ele) => ele.url);
    const [one, two, couple] = await Promise.all([getSlot(0, today), getSlot(1, today), getSlot(2, today)]);
    const slotInfo = {
      0: slotAvailable(one, today),
      1: slotAvailable(two, today),
      2: slotAvailable(couple, today),
    };
    const priceInfo = {
      0: pricingInfo.one,
      1: pricingInfo.two,
      2: pricingInfo.couple,
    };

    res.render("home", { imageUrlArray, slotInfo, priceInfo, whatsApp });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const aboutPage = async (req, res) => {
  try {
    const whatsApp = process.env.BUSINESS_NUMBER;
    const images = await Picture.find({ type: "gallery" }).sort({ createdDate: -1 }).limit(4);
    const imageUrlArray = images.map((ele) => ele.url);
    res.render("about", { whatsApp, imageUrlArray });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const termsPage = async (req, res) => {
  try {
    const whatsApp = process.env.BUSINESS_NUMBER;
    res.render("terms", { whatsApp });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const contactPage = async (req, res) => {
  try {
    const whatsApp = process.env.BUSINESS_NUMBER;
    res.render("contact", { whatsApp });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};
const faqPage = async (req, res) => {
  try {
    const whatsApp = process.env.BUSINESS_NUMBER;
    res.render("faq", { whatsApp });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};
const reviewPage = async (req, res) => {
  try {
    res.render("review");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};
const refundPage = async (req, res) => {
  try {
    const whatsApp = process.env.BUSINESS_NUMBER;
    res.render("refund", { whatsApp });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const servicesPage = async (req, res) => {
  try {
    const whatsApp = process.env.BUSINESS_NUMBER;
    res.render("services", { whatsApp });
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
module.exports = { homePage, aboutPage, termsPage, contactPage, faqPage, reviewPage, refundPage, servicesPage, slotAvailable };
