const express = require("express");
const router = express.Router();
const { addOnController } = require("../controllers/index");

router.get("/heathcheck", (req, res) => {
  return res.status(200).json({ status: "OK" });
});
router.post("/addAddon", addOnController.addAddon);
router.post("/addItemsInAddon", addOnController.addItemsInAddon);
router.get("/getAddon", addOnController.getAddon);

module.exports = router;
