const Admin = require("../models/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/helper");
const Booking = require("../models/bookingModel");
const { theaterType, decoration, cakeName } = require("../utils/constants");
const { getSlotInfo } = require("./bookingController");
const Picture = require("../models/pictureModel");
const path = require("path");
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if admin with the same email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin with this email already exists." });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
    });

    const savedAdmin = await newAdmin.save();
    res.status(201).json(savedAdmin);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error registering admin." });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Compare hashed password
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Password matched, generate a JWT token
    const authToken = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET);
    req.session.authToken = authToken;
    res.status(200).json({ success: true, message: "Login successful.", name: admin.name, email, authToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error logging in." });
  }
};

const loginPage = async (req, res) => {
  try {
    res.render("admin");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error loading admin login page" });
  }
};

const adminDashboard = async (req, res) => {
  try {
    const finalOutput = await getBookingDetails(req);
    res.render("adminDashboard", { data: finalOutput });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error loading admin login page" });
  }
};
const getBookingDetails = async (req) => {
  const { search } = req.query;
  const today = new Date();
  const indianTimeZoneOffset = 330; // (5 hours * 60 minutes) + 30 minutes
  today.setUTCMinutes(today.getUTCMinutes() + indianTimeZoneOffset);
  today.setUTCHours(0, 0, 0, 0);
  const searchFilter = search
    ? {
        $or: [{ "userDetails.name": { $regex: search, $options: "i" } }, { "userDetails.whatsapp": { $regex: search, $options: "i" } }, { bookingId: { $regex: search, $options: "i" } }],
      }
    : {};
  // Perform aggregation
  const result = await Booking.aggregate([
    {
      $addFields: {
        // Convert the string date to a date object
        bookingDateAsISO: {
          $dateFromString: {
            dateString: {
              $concat: [
                { $substr: ["$bookingDate", 6, 4] },
                "-", // Year
                { $substr: ["$bookingDate", 3, 2] },
                "-", // Month
                { $substr: ["$bookingDate", 0, 2] }, // Day
              ],
            },
            format: "%Y-%m-%d",
          },
        },
      },
    },
    { $match: { bookingDateAsISO: { $gte: today }, ...searchFilter } }, // Filter by bookingDate
    { $sort: { bookingDateAsISO: 1, slotId: 1 } }, // Sort by slotId in ascending order
    { $limit: 25 },
    {
      $project: {
        bookingId: 1,
        bookingDate: 1,
        theaterId: 1,
        slotId: 1,
        amountPaid: 1,
        bookingStatus: 1,
        userDetails: 1,
      },
    },
  ]);
  const finalOutput = result.map((bookingData) => {
    let addOn = "Not Required";
    if (bookingData.userDetails.chocolate && bookingData.userDetails.bouquet) {
      addOn = "Chocolate & Bouquet";
    } else if (bookingData.userDetails.chocolate) {
      addOn = "Chocolate";
    } else if (bookingData.userDetails.bouquet) {
      addOn = "Bouquet";
    }
    return {
      orderId: bookingData.bookingId,
      amount: bookingData.amountPaid,
      theaterName: theaterType[bookingData.theaterId],
      slotInfo: getSlotInfo(bookingData.theaterId, bookingData.slotId).name,
      date: bookingData.bookingDate,
      noOfPerson: bookingData.userDetails.noOfPerson,
      cakeName: cakeName[bookingData?.userDetails?.cake] ? cakeName[bookingData?.userDetails?.cake] : "Not Required",
      decorationName: decoration[bookingData?.userDetails?.decoration] ? decoration[bookingData?.userDetails?.decoration] : "Not Required",
      addOn: addOn,
      name: bookingData.userDetails.name,
      contactId: bookingData.userDetails.whatsapp,
      email: bookingData.userDetails.email,
    };
  });
  return finalOutput;
};
const search = async (req, res) => {
  try {
    const finalOutput = await getBookingDetails(req);
    res.json({ data: finalOutput });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error loading admin login page" });
  }
};

const logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Error logging out");
    }
    // Redirect the user to the login page after logout
    res.redirect("/admin/login");
  });
};

const adminImage = async (req, res) => {
  try {
    const images = await Picture.find({ type: "gallery" }).sort({ createdDate: -1 });

    res.render("adminImage", { images });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error loading admin login page" });
  }
};
const adminBooking = async (req, res) => {
  try {
    res.render("adminBooking");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error loading admin login page" });
  }
};

const updateBooking = async (req, res) => {
  const { bookingId, newBookingDate, newSlotId } = req.body;
  try {
    // Find the booking by bookingId
    const booking = await Booking.findOne({ bookingId });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update bookingDate and slotId if new values are provided
    if (newBookingDate) {
      booking.bookingDate = newBookingDate;
      booking.slotId = newSlotId;
    }
    // Save the updated booking
    const bookingData = await booking.save();
    // const finalOutput = {
    //   orderId: bookingData.bookingId,
    //   amount: bookingData.amountPaid,
    //   theaterName: theaterType[bookingData.theaterId],
    //   slotInfo: `Slot ${getSlotInfo(bookingData.theaterId, bookingData.slotId).name} on ${bookingData.bookingDate}`,
    //   noOfPerson: bookingData.userDetails.noOfPerson,
    //   cakeName: cakeName[bookingData?.userDetails?.cake] ? cakeName[bookingData?.userDetails?.cake] : "Not Required",
    //   decorationName: decoration[bookingData?.userDetails?.decoration] ? decoration[bookingData?.userDetails?.decoration] : "Not Required",
    //   addOn: addOn,
    //   name: bookingData.userDetails.name,
    //   contactId: bookingData.userDetails.whatsapp,
    //   email: bookingData.userDetails.email,
    // };
    // if (process.env.SEND_EMAIL === "true") {
    //   const templatePath = path.join(__dirname, "../../views", "orderUpdateEmail.ejs");
    //   // sendEmail(
    //   //   finalOutput.email, // Recipient's email address
    //   //   "Booking rescheduled", // Email subject
    //   //   templatePath, // Path to the EJS template file
    //   //   finalOutput
    //   // );
    // }

    const slotValue = getSlotInfo(bookingData.theaterId, bookingData.slotId).name;

    res.status(200).json({ message: "Booking updated successfully", slotValue });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ message: "An error occurred while updating booking" });
  }
};

const booking = async (req, res) => {
  try {
    const { userInfo } = req.body;
    const payload = userInfo.payload;
    // Create Booking
    const newBooking = new Booking({
      bookingId: payload.receipt,
      bookingDate: payload.date,
      amountPaid: userInfo.amount,
      theaterId: parseInt(payload.theaterid),
      slotId: parseInt(payload.slot),
      userDetails: { name: payload.name, whatsapp: payload.whatsapp, email: payload.email, noOfPerson: payload.count, decoration: payload.decoration, cake: payload.cake },
    });
    const bookingData = await newBooking.save();
    const finalOutput = {
      orderId: bookingData.bookingId,
      amount: bookingData.amountPaid,
      theaterName: theaterType[bookingData.theaterId],
      slotInfo: `Slot ${getSlotInfo(bookingData.theaterId, bookingData.slotId).name} on ${bookingData.bookingDate}`,
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
    // await sendOrderConfirmationNotifiaction(finalOutput);
    res.status(201).json({ success: true, finalOutput });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
module.exports = { registerAdmin, loginAdmin, loginPage, adminDashboard, logout, search, adminImage, adminBooking, updateBooking, booking };
