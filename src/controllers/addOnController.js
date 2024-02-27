const Addon = require("../models/addonModel");

// controller to add a new addon
const addAddon = async (req, res) => {
  try {
    const { title, items } = req.body;
    const addon = new Addon({ addons: [{ title, items }] });
    await addon.save();
    res.status(201).json(addon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const addItemsInAddon = async (req, res) => {
  try {
    const { name, image, price } = req.body;
    const addon = await Addon.findById(req.params.addonId);
    if (!addon) {
      return res.status(404).json({ message: "Addon not found" });
    }
    addon.addons[0].items.push({ name, image, price });
    await addon.save();
    res.status(201).json(addon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// controller to get all addons
const getAddon = async (req, res) => {
  try {
    const addons = await Addon.find();
    res.json(addons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  addAddon,
  getAddon,
  addItemsInAddon,
};
