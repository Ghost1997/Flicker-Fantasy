const Booking = require("../models/bookingModel");
const { getTodaysFormattedDate } = require("../utils/helper");
const { pricingInfo, theaterType, decoration, decorationPrice, cakePricingInfo, cakeName } = require("../utils/constants");
const Razorpay = require("razorpay");
const crypto = require("crypto");

// const bookTheater = async (req, res) => {
//   try {
//     const data = req.body;
//     const { todaysDate, timeStamp } = getTodaysFormattedDate();
//     const newBooking = new Booking({
//       bookingId: timeStamp,
//       bookingDate: todaysDate,
//       amountPaid,
//       theaterId,
//       slotId,
//       amountPaid,
//       userDetails,
//     });
//     const savedBooking = await newBooking.save();
//     res.status(201).json(savedBooking);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

const calculate = async (req, res) => {
  const payload = req.body;
  const razorpay = new Razorpay({
    key_id: process.env.PAYMENT_API_KEY,
    key_secret: process.env.PAYMENT_SECRET,
  });
  const amount = calculateAmount(payload.theaterid, payload.cake, payload.decoration);
  const dateValue = getTodaysFormattedDate();
  const receipt = dateValue.timeStamp;
  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt,
  };
  const order = await razorpay.orders.create(options);
  const orderId = order.id;
  payload.receipt = receipt;
  res.status(200).json({ amount, orderId, payload });
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

const confirmBooking = async (req, res) => {
  try {
    const { paymentInfo, userInfo } = req.body;

    // Validate HMAC Signature
    const hmac = crypto.createHmac("sha256", process.env.PAYMENT_SECRET);
    hmac.update(paymentInfo.razorpay_order_id + "|" + paymentInfo.razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");
    const isSignatureValid = generatedSignature === paymentInfo.razorpay_signature;

    if (!isSignatureValid) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const razorpay = new Razorpay({
      key_id: process.env.PAYMENT_API_KEY,
      key_secret: process.env.PAYMENT_SECRET,
    });

    // Fetch Payment Details from Razorpay
    const paymentDetails = await razorpay.payments.fetch(paymentInfo.razorpay_payment_id);

    if (paymentDetails.status !== "captured") {
      return res.status(400).json({ message: "Payment not captured" });
    }

    // Create Booking
    const newBooking = new Booking({
      bookingId: userInfo.receipt,
      bookingDate: userInfo.date,
      amountPaid: paymentDetails.amount / 100,
      theaterId: parseInt(userInfo.theaterid),
      slotId: parseInt(userInfo.slot),
      userDetails: { name: userInfo.name, whatsapp: userInfo.whatsapp, email: userInfo.email, noOfPerson: userInfo.count, decoration: userInfo.decoration, cake: userInfo.cake },
      paymentDetails: paymentDetails,
      paymentResponse: paymentInfo,
      signatureVerified: isSignatureValid,
    });
    const bookingData = await newBooking.save();
    const finalOutput = {
      orderId: bookingData.bookingId,
      amount: bookingData.amountPaid,
      theaterName: theaterType[bookingData.theaterId],
      slotInfo: `Slot ${bookingData.slotId} on ${bookingData.bookingDate}`,
      noOfPerson: bookingData.userDetails.noOfPerson,
      cakeName: cakeName[bookingData?.userDetails?.cake] ? cakeName[bookingData?.userDetails?.cake] : "Not Required",
      decorationName: decoration.includes(bookingData.userDetails.decoration) ? bookingData.userDetails.decoration : "Not Required",
      name: bookingData.userDetails.name,
      contactId: bookingData.userDetails.whatsapp,
      email: bookingData.userDetails.email,
    };
    res.status(201).json(finalOutput);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const successBooking = async (req, res) => {
  try {
    const data = req.query;
    res.render("order", { data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { calculate, confirmBooking, successBooking };
