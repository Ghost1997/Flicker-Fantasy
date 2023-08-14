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

  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();

  const [startHour, startMinute] = startTime.split(":").map((str) => parseInt(str));
  const [endHour, endMinute] = endTime.split(":").map((str) => parseInt(str));

  if (startHour < endHour) {
    // Time slot does not cross midnight
    if (currentHour > startHour && currentHour < endHour) {
      return true;
    } else if (currentHour === startHour && currentMinute >= startMinute) {
      return true;
    } else if (currentHour === endHour && currentMinute <= endMinute) {
      return true;
    } else {
      return false;
    }
  } else if (startHour > endHour) {
    // Time slot crosses midnight
    if (currentHour > startHour || currentHour < endHour) {
      return true;
    } else if (currentHour === startHour && currentMinute >= startMinute) {
      return true;
    } else if (currentHour === endHour && currentMinute <= endMinute) {
      return true;
    } else {
      return false;
    }
  } else {
    // Time slot starts and ends at the same hour
    if (currentHour === startHour && currentMinute >= startMinute && currentMinute <= endMinute) {
      return true;
    } else {
      return false;
    }
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
    // console.log(dateValue, moment().tz("Asia/Kolkata").format("DD/MM/YYYY"));
    if (dateValue === moment().tz("Asia/Kolkata").format("DD/MM/YYYY") && ele.booked === false) {
      ele.booked = checkTimeSlot(ele.value);
    }
    return ele;
  });
  return finalSlots;
};

module.exports = { saveTheaterInfo, getSlotInfo, getSlot };
