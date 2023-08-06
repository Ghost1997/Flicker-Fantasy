const Booking = require("../models/bookingModel");
const { getTodaysFormattedDate } = require("../utils/helper");
const bookTheater = async (req, res) => {
  try {
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

const calculate = async (req, res) => {
  const { date, slot, name, whatsapp, email, count, decorationRequired, cakeRequired, theaterid } = req.body;
  res.status(200).json({});
};
module.exports = { bookTheater, calculate };
