const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.render("home");
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
