const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");

const authenticateAdmin = async (req, res, next) => {
  try {
    const authToken = req.session.authToken;
    const secret = process.env.JWT_SECRET;
    if (!authToken) {
      return res.render("unauthorized");
    }

    const decodedToken = jwt.verify(authToken, secret); // Replace with your actual secret key
    const admin = await Admin.findOne({ _id: decodedToken._id });

    if (!admin) {
      return res.status(401).json({ error: "Invalid authentication token." });
    }

    // Store the decoded token in the request for further use
    req.decodedToken = decodedToken;

    // Continue with the next middleware
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Authentication error." });
  }
};

module.exports = { authenticateAdmin };
