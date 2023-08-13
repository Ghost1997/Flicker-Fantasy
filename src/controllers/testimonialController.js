const Testimonial = require("../models/testimonialModel");

const saveTestimonial = async (req, res) => {
  try {
    const { name, comment } = req.body;
    const newTestimonial = new Testimonial({
      name,
      comment,
    });
    const savedTestimonial = await newTestimonial.save();
    res.render("submittedReview");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error saving testimonial" });
  }
};

module.exports = { saveTestimonial };
