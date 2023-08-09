const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
  },
  bookingDate: {
    type: String,
    required: true,
  },
  theaterId: {
    type: Number,
    required: true,
  },
  slotId: {
    type: Number,
    required: true,
  },
  amountPaid: {
    type: Number,
    required: true,
  },
  bookingStatus: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled"],
    default: "Confirmed",
  },
  userDetails: { type: Object },
  paymentDetails: { type: Object },
  paymentResponse: { type: Object },
  signatureVerified: {
    type: Boolean,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
