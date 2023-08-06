const Theater = require("../models/theaterModel");
const Booking = require("../models/bookingModel");
const moment = require("moment");
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
    const data = await getSlot(theaterId, dateValue);
    res.status(200).json({
      message: "Success",
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting theater slots" });
  }
};

function checkTimeSlot(timeSlot) {
  const [startTimeStr, endTimeStr] = timeSlot.split("-");
  const startTime = startTimeStr.trim();
  const endTime = endTimeStr.trim();
  const currentTime = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" });
  console.log(currentTime);
  if (currentTime < startTime) {
    return false;
  } else if (currentTime >= startTime && currentTime <= endTime) {
    return true;
  } else {
    return true;
  }
}

const getSlot = async (theaterId, dateValue) => {
  const theater = await Theater.findOne({ theaterId });

  const bookings = await Booking.find({ theaterId, bookingDate: dateValue }, "bookingId bookingDate theaterId slotId bookingStatus");

  const result = theater.slots.map((ele) => ({
    id: ele.id,
    value: ele.value,
    booked: bookings.some((booking) => booking.bookingDate === dateValue && booking.slotId === ele.id && booking.bookingStatus === "Confirmed"),
  }));

  const finalSlots = result.map((ele) => {
    if (dateValue === moment().format("DD/MM/YYYY") && ele.booked === false) {
      ele.booked = checkTimeSlot(ele.value);
    }
    return ele;
  });
  return finalSlots;
};

module.exports = { saveTheaterInfo, getSlotInfo, getSlot };
