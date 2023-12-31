const Booking = require("../models/bookingModel");
const { getTodaysFormattedDate, sendEmail } = require("../utils/helper");
const { pricingInfo, theaterType, decoration, decorationPrice, cakePricingInfo, cakeName, advanceDecorationPrice, slotInfo } = require("../utils/constants");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const calculate = async (req, res) => {
  try {
    const payload = req.body;
    const razorpay = new Razorpay({
      key_id: process.env.PAYMENT_API_KEY,
      key_secret: process.env.PAYMENT_SECRET,
    });
    const amount = calculateAmount(payload.theaterid, payload.cake, payload.decoration);
    const dateValue = getTodaysFormattedDate();
    const receipt = dateValue.timeStamp.toString();
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt,
    };
    const order = await razorpay.orders.create(options);
    const orderId = order.id;
    payload.receipt = receipt;
    res.status(200).json({ amount, orderId, payload });
  } catch (err) {
    console.log(err);
  }
};

const calculateAmount = (theaterId, cake, decoration) => {
  try {
    let amount = 0;
    const theaterTypeSelected = theaterType[theaterId];
    amount += pricingInfo[theaterTypeSelected];

    if (cake.length && cakePricingInfo[cake]) {
      amount += cakePricingInfo[cake];
    }

    if (decoration.length) {
      decoration.includes("Advance") ? (amount += advanceDecorationPrice) : (amount += decorationPrice);
    }

    const additionalCharge = amount * 0.025; // 2.5% of the total amount
    amount += parseInt(additionalCharge);
    return amount;
  } catch (err) {
    console.log(err);
  }
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
      slotInfo: `Slot ${getSlotInfo(bookingData.theaterId, bookingData.slotId)} on ${bookingData.bookingDate}`,
      noOfPerson: bookingData.userDetails.noOfPerson,
      cakeName: cakeName[bookingData?.userDetails?.cake] ? cakeName[bookingData?.userDetails?.cake] : "Not Required",
      decorationName: decoration.includes(bookingData.userDetails.decoration) ? bookingData.userDetails.decoration : "Not Required",
      name: bookingData.userDetails.name,
      contactId: bookingData.userDetails.whatsapp,
      email: bookingData.userDetails.email,
    };
    if (process.env.SEND_EMAIL === "true") {
      const templatePath = path.join(__dirname, "../../views", "orderEmail.ejs");
      sendEmail(
        finalOutput.email, // Recipient's email address
        "Booking confirmation", // Email subject
        templatePath, // Path to the EJS template file
        finalOutput
      );
    }
    res.status(201).json(finalOutput);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const successBooking = async (req, res) => {
  try {
    const data = req.query;
    if (Object.keys(data).length === 0) res.render("404");
    else res.render("order", { data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const sendBookingRequest = async (req, res) => {
  try {
    const { payload, amount } = req.body;
    const finalOutput = {
      theaterName: theaterType[parseInt(payload.theaterid)],
      slotInfo: `Slot ${getSlotInfo(parseInt(payload.theaterid), parseInt(payload.slot))} on ${payload.date}`,
      noOfPerson: payload.count,
      cakeName: cakeName[payload?.cake] ? cakeName[payload?.cake] : "Not Required",
      decorationName: decoration.includes(payload.decoration) ? payload.decoration : "Not Required",
      name: payload.name,
      contactId: payload.whatsapp,
      email: payload.email,
      amount: amount,
    };
    await bookingRequestNotification(finalOutput);
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const bookingRequestNotification = async (finalOutput) => {
  try {
    console.log(finalOutput);
    const accountSid = process.env.TWILLIO_SID;
    const authToken = process.env.TWILLIO_AUTH;

    if (!accountSid || !authToken) {
      console.error("Twilio credentials are missing. Unable to send WhatsApp notification.");
      return;
    }

    const client = require("twilio")(accountSid, authToken);

    const sendMessage = await client.messages.create({
      body: `You have a new booking request\n\nBooking Request details:\n\n*Name*: ${finalOutput.name}\n*Email*: ${finalOutput.email}\n*Phone*: ${finalOutput.contactId}\n*Slot Info*: ${finalOutput.slotInfo}\n*Number of people*: ${finalOutput.noOfPerson}\n*Theater*: ${finalOutput.theaterName}\n*Decoration*: ${finalOutput.decorationName}\n*Cake*: ${finalOutput.cakeName}\n*Total amount*: Rs ${finalOutput.amount}\n\nTake appropriate action`,
      from: `whatsapp:${process.env.TWILLIO_SENDER_PHONE}`,
      to: `whatsapp:${process.env.TWILLIO_RECIVER_PHONE}`,
    });
    console.log(sendMessage);
  } catch (error) {
    console.log(error);
    console.error("Error sending WhatsApp notification:", error.message);
  }
};

function getSlotInfo(theaterId, slotId) {
  const theater = slotInfo.find((theater) => theater.theaterId === theaterId);
  if (theater) {
    const slot = theater.slots.find((slot) => slot.id === slotId);
    if (slot) {
      return slot.value;
    }
  }
  return "Slot information not found";
}

const requestRecived = async (req, res) => {
  try {
    res.render("requestRecived");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};
module.exports = { calculate, confirmBooking, successBooking, getSlotInfo, sendBookingRequest, requestRecived };
