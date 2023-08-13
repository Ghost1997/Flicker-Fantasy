const Admin = require("../models/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

    res.status(200).json({ message: "Login successful.", name: admin.name, email, authToken });
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

module.exports = { registerAdmin, loginAdmin, loginPage };
