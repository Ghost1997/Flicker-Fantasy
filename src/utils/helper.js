const moment = require("moment-timezone");
const nodemailer = require("nodemailer");
const getTodaysFormattedDate = () => {
  const todaysDate = moment().tz("Asia/Kolkata").format("DD/MM/YYYY");
  const timeStamp = moment().unix();
  return { todaysDate, timeStamp };
};
const sendEmailWithTemplate = async (toEmail, subject, htmlContent) => {
  try {
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_SERVER,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.BUSINESS_EMAIL,
      to: toEmail,
      bcc: process.env.BUSINESS_EMAIL,
      subject: subject,
      html: htmlContent,
    };

    const info = await transport.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { getTodaysFormattedDate, sendEmailWithTemplate };
