const Picture = require("../models/pictureModel");
const Testimonial = require("../models/testimonialModel");
const homePage = async (req, res) => {
  try {
    const imageCount = process.env.IMAGE_COUNT;
    const testimonialCount = process.env.FEEDBACK_COUNT;
    const [images, testimonials] = await Promise.all([Picture.find().sort({ createdDate: -1 }).limit(imageCount), Testimonial.find().sort({ createdAt: -1 }).limit(testimonialCount)]);
    const imageUrlArray = images.map((ele) => ele.url);
    const testimonialArray = testimonials.map((ele) => {
      return {
        name: ele.name,
        comment: ele.comment,
      };
    });
    res.render("home", { imageUrlArray, testimonialArray });
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

module.exports = { homePage, aboutPage, termsPage };
