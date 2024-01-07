const Theater = require("../models/theaterModel");
const Booking = require("../models/bookingModel");
const moment = require("moment-timezone");
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
    let { theaterId, dateValue, orderId } = req.body;
    if (orderId && !theaterId) {
      const booking = await Booking.findOne({ bookingId: orderId }).select("theaterId");
      theaterId = booking.theaterId;
    }
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
  let currentTime = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" });
  const [hours, minutes] = currentTime.split(":");
  const formattedHours = hours === "24" ? "00" : hours;
  currentTime = `${formattedHours}:${minutes}`;
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

  const result = (theater.slots || []).map((ele) => {
    const isSunday = moment(dateValue, "DD/MM/YYYY").day() === 0; // Check if it's a Sunday
    const isLastSlot = ele.id === theater.slots.length - 1; // Check if it's the last slot

    return {
      id: ele.id,
      value: ele.value,
      slotname: ele.slotname,
      booked: bookings.some((booking) => booking.bookingDate === dateValue && booking.slotId === ele.id && booking.bookingStatus === "Confirmed") || (isSunday && isLastSlot), // Mark as booked on Sunday for the last slot
    };
  });

  const finalSlots = result.map((ele) => {
    if (dateValue === moment().tz("Asia/Kolkata").format("DD/MM/YYYY") && ele.booked === false) {
      ele.booked = checkTimeSlot(ele.value);
    }
    return ele;
  });

  return finalSlots;
};

module.exports = { saveTheaterInfo, getSlotInfo, getSlot };
