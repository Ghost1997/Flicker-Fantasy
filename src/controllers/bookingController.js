const Booking = require("../models/bookingModel");
const { getTodaysFormattedDate } = require("../utils/helper");
const { pricingInfo, theaterType, decorationPrice, cakePricingInfo } = require("../utils/constants");
const Razorpay = require("razorpay");

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
  const { date, slot, name, whatsapp, email, count, decoration, cake, theaterid } = req.body;
  const razorpay = new Razorpay({
    key_id: process.env.PAYMENT_API_KEY,
    key_secret: process.env.PAYMENT_SECRET,
  });
  const amount = calculateAmount(theaterid, cake, decoration);
  const dateValue = getTodaysFormattedDate();
  const receipt = dateValue.timeStamp;
  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt,
  };
  const order = await razorpay.orders.create(options);
  const orderId = order.id;
  res.status(200).json({ amount, orderId });
};

const calculateAmount = (theaterId, cake, decoration) => {
  let amount = 0;

  const theaterTypeSelected = theaterType[theaterId];
  amount += pricingInfo[theaterTypeSelected];

  if (cake.length && cakePricingInfo[cake]) {
    amount += cakePricingInfo[cake];
  }

  if (decoration.length) {
    amount += decorationPrice;
  }

  return amount;
};
module.exports = { bookTheater, calculate };
