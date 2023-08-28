const moment = require("moment-timezone");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const AWS = require("aws-sdk");
const getTodaysFormattedDate = () => {
  const todaysDate = moment().tz("Asia/Kolkata").format("DD/MM/YYYY");
  const timeStamp = moment().unix();
  return { todaysDate, timeStamp };
};

async function sendEmail(to, subject, templatePath, data) {
  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
    region: process.env.AWS_REGION,
  });
  try {
    const transporter = nodemailer.createTransport({
      SES: new AWS.SES(),
    });

    // Read and render the EJS template
    const template = await ejs.renderFile(templatePath, { data });

    // Define email options
    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL,
      to: to,
      bcc: process.env.BUSINESS_EMAIL,
      subject: subject,
      html: template,
    };

    // Send the email
    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent:", result.response);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
module.exports = { getTodaysFormattedDate, sendEmail };
