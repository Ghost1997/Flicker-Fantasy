const Theater = require("../models/theaterModel");
const Booking = require("../models/bookingModel");

const saveTheaterInfo = async (req, res) => {
  try {
    const { data } = req.body;
    const saveTheaters = await Theater.insertMany(data);
    res.status(201).json(saveTheaters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating theater" });
  }
};

const getSlotInfo = async (req, res) => {
  try {
    const { theaterId, dateValue } = req.body;

    const theater = await Theater.findOne({ theaterId });
    if (!theater) {
      return res.status(200).json({
        message: "Theater not found.",
        data: [],
      });
    }

    const bookings = await Booking.find({ theaterId, bookingDate: dateValue }, "bookingId bookingDate theaterId slotId bookingStatus");

    const result = theater.slots.map((ele) => ({
      id: ele.id,
      value: ele.value,
      booked: bookings.some((booking) => booking.bookingDate === dateValue && booking.slotId === ele.id && booking.bookingStatus === "Confirmed"),
    }));

    res.status(200).json({
      message: "Success",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting theater slots" });
  }
};

module.exports = { saveTheaterInfo, getSlotInfo };
