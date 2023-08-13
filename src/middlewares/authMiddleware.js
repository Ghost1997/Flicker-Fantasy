const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");

const authenticateAdmin = async (req, res, next) => {
  try {
    const authToken = req.header("Authorization");

    if (!authToken) {
      return res.status(401).json({ error: "Authentication token missing." });
    }

    const decodedToken = jwt.verify(authToken, "your_secret_key"); // Replace with your actual secret key
    const admin = await Admin.findOne({ _id: decodedToken._id });

    if (!admin) {
      return res.status(401).json({ error: "Invalid authentication token." });
    }

    req.admin = admin; // Store admin data in the request for further use
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Authentication error." });
  }
};

module.exports = authenticateAdmin;
