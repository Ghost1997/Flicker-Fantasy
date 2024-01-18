const Booking = require("../models/bookingModel");
const { getTodaysFormattedDate, sendEmail } = require("../utils/helper");
const { theaterType, decoration, cakeName, slotInfo } = require("../utils/constants");
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

    const amount = calculateTotalCost(payload.theaterid, payload.decoration, payload.count, payload.chocolate, payload.bouquet);
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

const calculateTotalCost = (theaterId, packageType, numberOfPeople, chocolate, bouquet) => {
  // Base prices for each package
  const packagePrices = {
    birthday: 1999,
    anniversary: 1999,
    brideToBe: 2299,
    momToBe: 2299,
    marriage: 2999,
    privateTheater: {
      couple: 1199,
      one: 1299,
      two: 1299,
    },
  };
  const addOnPrice = {
    chocolate: 449,
    bouquet: 349,
  };

  const theaters = {
    0: "one",
    1: "two",
    2: "couple",
  };
  const theaterType = theaters[theaterId];

  // Seating capacity for each theater type
  const seatingCapacity = {
    couple: 2,
    one: 6,
    two: 6,
  };

  // Additional charge for extra person above 4 in one and two
  const extraPersonCharge = 200;

  // Tax rate
  const taxRate = 2.5 / 100;

  // Calculate base cost based on theater type and package type
  let baseCost;
  if (packageType === "privateTheater") {
    baseCost = theaterType === "couple" ? packagePrices.privateTheater.couple : packagePrices.privateTheater.one;
  } else {
    baseCost = packagePrices[packageType];
  }
  const extraPersonCount = numberOfPeople > 4 ? numberOfPeople - 4 : 0;
  baseCost += extraPersonCount * extraPersonCharge;

  if (chocolate && bouquet) {
    baseCost = baseCost + addOnPrice.chocolate + addOnPrice.bouquet;
  } else if (chocolate) {
    baseCost = baseCost + addOnPrice.chocolate;
  } else if (bouquet) {
    baseCost = baseCost + addOnPrice.bouquet;
  }

  const tax = baseCost * taxRate;
  const totalCost = baseCost + tax;

  return parseInt(totalCost);
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
      userDetails: {
        name: userInfo.name,
        whatsapp: userInfo.whatsapp,
        email: userInfo.email,
        noOfPerson: userInfo.count,
        decoration: userInfo.decoration,
        cake: userInfo.cake,
        message: userInfo.message,
        chocolate: userInfo.chocolate,
        bouquet: userInfo.bouquet,
      },
      paymentDetails: paymentDetails,
      paymentResponse: paymentInfo,
      signatureVerified: isSignatureValid,
    });
    const bookingData = await newBooking.save();
    let addOn = "Not Required";
    if (userInfo.chocolate && userInfo.bouquet) {
      addOn = "Chocolate & Bouquet";
    } else if (userInfo.chocolate) {
      addOn = "Chocolate";
    } else if (userInfo.bouquet) {
      addOn = "Bouquet";
    }
    const finalOutput = {
      orderId: bookingData.bookingId,
      amount: bookingData.amountPaid,
      theaterName: theaterType[bookingData.theaterId],
      slotInfo: `Slot ${getSlotInfo(bookingData.theaterId, bookingData.slotId).name} on ${bookingData.bookingDate}`,
      noOfPerson: bookingData.userDetails.noOfPerson,
      cakeName: cakeName[bookingData?.userDetails?.cake] ? cakeName[bookingData?.userDetails?.cake] : "Not Required",
      decorationName: decoration[bookingData?.userDetails?.decoration] ? decoration[bookingData?.userDetails?.decoration] : "Not Required",
      message: bookingData?.userDetails?.message ? bookingData?.userDetails?.message : "Not Required",
      addOn: addOn,
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
    if (process.env.SEND_MESSAGE === "true") {
      const recipientPhoneNumber = `whatsapp:+91${finalOutput.contactId}`; // Replace with the recipient's phone number

      const messageOne = `Flicker Fantasy - Your Private Theater Experience 🎬

      Hello ${finalOutput.name}! 
      
      *We're thrilled to confirm your upcoming theater booking at Flicker Fantasy. Here are the details:*
      
      *Date & Time:* ${finalOutput.slotInfo}
      
      Address: 595, Govindaraja Nagar Ward, Opp Ganesh Gandhi Medicals, Bengaluru, 560040]
      
      *Theater:* ${finalOutput.theaterName}
      
      *Package:* ${finalOutput.decorationName}
      
      *Number of People:* ${finalOutput.noOfPerson}
      
      *Cake:* ${finalOutput.cakeName}
      
      *Add On:* ${finalOutput.addOn}
      
      *Total Cost:* ₹${finalOutput.amount} (including 2.5% platform fee)
      
      *Location Map:* https://shorturl.at/brDW2
      
      We can't wait to host your special event! For any assistance, contact us at:
      📞 *Phone:* +917019693927
      
      See you soon at Flicker Fantasy! 🍿🎥`;

      const messageTwo = `*Please note the following Terms and conditions for your booking:*

    1. Smoking/Drinking is *NOT* allowed inside the theater. 
    
    2. Any *DAMAGE* caused to theater, including decorative materials like balloons, lights etc will have to be reimbursed.
    
    3. Guests are requested to maintain *CLEANLINESS* inside the theater.
    
    4. Party poppers/Snow sprays/Cold Fire/Sparkle candles, and any other similar items are strictly *PROHIBITED* inside the theater.
    
    5. Carrying *AADHAAR CARD/DL* is mandatory. It will be checked during entry.
    
    6. Couples below 18 years age are not allowed to enter the theater. Under *18 years* can come in groups.
    
    7. Refund will be processed only if the booking is cancelled *AT LEAST 72 HOURS BEFORE* the booking time.`;

      // send message to customer
      sendWhatsAppmessage(messageOne, recipientPhoneNumber);
      sendWhatsAppmessage(messageTwo, recipientPhoneNumber);
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

const sendWhatsAppmessage = async (message, recipientPhoneNumber) => {
  try {
    const accountSid = process.env.TWILLIO_SID;
    const authToken = process.env.TWILLIO_AUTH;

    if (!accountSid || !authToken) {
      console.error("Twilio credentials are missing. Unable to send WhatsApp notification.");
      return;
    }
    const client = require("twilio")(accountSid, authToken);
    client.messages
      .create({
        from: `whatsapp:${process.env.TWILLIO_SENDER_PHONE}`, // Replace with your Twilio WhatsApp number
        body: message,
        to: recipientPhoneNumber,
      })
      .then((message) => console.log(`WhatsApp message sent. SID: ${message.sid}`))
      .catch((error) => console.error(`Error sending WhatsApp message: ${error.message}`));
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
      return { name: slot.slotname, value: slot.value };
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
module.exports = { calculate, confirmBooking, successBooking, getSlotInfo, requestRecived };
