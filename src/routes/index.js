const express = require("express");
const router = express.Router();
const { addOnController } = require("../controllers/index");

router.post("/addAddon", addOnController.addAddon);
router.post("/addItemsInAddon", addOnController.addItemsInAddon);
router.get("/getAddon", addOnController.getAddon);

module.exports = router;
