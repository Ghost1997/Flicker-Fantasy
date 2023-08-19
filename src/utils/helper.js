const moment = require("moment-timezone");
const nodemailer = require("nodemailer");
const getTodaysFormattedDate = () => {
  const todaysDate = moment().tz("Asia/Kolkata").format("DD/MM/YYYY");
  const timeStamp = moment().unix();
  return { todaysDate, timeStamp };
};

module.exports = { getTodaysFormattedDate };
