const Booking = require("../models/bookingModel");
const { getTodaysFormattedDate } = require("../utils/helper");
const bookTheater = async (req, res) => {
  try {
    console.log(req.body);
    const { theaterId, slotId, amountPaid, userDetails } = req.body;
    const { todaysDate, timeStamp } = getTodaysFormattedDate();
    const newBooking = new Booking({
      bookingId: timeStamp,
      bookingDate: todaysDate,
      amountPaid,
      theaterId,
      slotId,
      amountPaid,
      userDetails,
    });
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { bookTheater };
