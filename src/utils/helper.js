const moment = require("moment-timezone");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const getTodaysFormattedDate = () => {
  const todaysDate = moment().tz("Asia/Kolkata").format("DD/MM/YYYY");
  const timeStamp = moment().unix();
  return { todaysDate, timeStamp };
};

async function sendEmail(to, subject, templatePath, data) {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp-relay.sendinblue.com",
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
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
