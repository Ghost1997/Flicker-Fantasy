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
  userDetails: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    whatsapp: {
      type: String,
      required: true,
    },
    cakeRequired: {
      type: Boolean,
      default: false,
    },
    decorationRequired: {
      type: Boolean,
      default: false,
    },
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
