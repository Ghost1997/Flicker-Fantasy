const pricingInfo = {
  executive: 499,
  couple: 599,
  standerd: 599,
};

const theaterType = {
  0: "executive",
  1: "standerd",
  2: "couple",
};

const cakePricingInfo = {
  blackForest: 500,
  butterScotch: 500,
  chocolate: 500,
  pineApple: 500,
  roundRedVelvet: 600,
  buleBerry: 600,
  mangoCake: 600,
  heartRedVelvet: 600,
  deathByChocolate: 700,
  chocoAlmond: 750,
  heartPinata: 850,
};
const cakeName = {
  blackForest: "Black Forest",
  butterScotch: "Butter Scotch",
  chocolate: "Chocolate",
  pineApple: "Pine Apple",
  roundRedVelvet: "Round Red Velvet",
  buleBerry: "Blueberry",
  mangoCake: "Mango Cake",
  heartRedVelvet: "Heart Red Velvet",
  deathByChocolate: "Death By Chocolate",
  chocoAlmond: "Choco Almond",
  heartPinata: "Heart Pinata",
};

const decorationPrice = 300;
const decoration = ["Birthday", "Aniversary", "Romantic Date", "Marriage Proposal", "Bride To Be", "Farewell", "Congratulations", "Baby Shower"];
const emailSubject = "Flicker Fantasy Order Confirmation";

module.exports = { pricingInfo, theaterType, decoration, decorationPrice, cakePricingInfo, cakeName, emailSubject };
