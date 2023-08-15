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

const slotInfo = [
  {
    theaterId: 0,
    slots: [
      {
        id: 0,
        value: "09:00 - 10:45",
        _id: {
          $oid: "64cdd777f2e9bc2fdb53c5cd",
        },
      },
      {
        id: 1,
        value: "11:00 - 12:45",
        _id: {
          $oid: "64cdd777f2e9bc2fdb53c5ce",
        },
      },
      {
        id: 2,
        value: "13:00 - 14:45",
        _id: {
          $oid: "64cdd777f2e9bc2fdb53c5cf",
        },
      },
      {
        id: 3,
        value: "15:00 - 16:45",
        _id: {
          $oid: "64cdd777f2e9bc2fdb53c5d0",
        },
      },
      {
        id: 4,
        value: "17:00 - 18:45",
        _id: {
          $oid: "64cdd777f2e9bc2fdb53c5d1",
        },
      },
      {
        id: 5,
        value: "19:00 - 20:45",
        _id: {
          $oid: "64cdd777f2e9bc2fdb53c5d2",
        },
      },
      {
        id: 6,
        value: "21:00 - 22:45",
        _id: {
          $oid: "64cdd777f2e9bc2fdb53c5d3",
        },
      },
      {
        id: 7,
        value: "23:00 - 00:45",
        _id: {
          $oid: "64cdd777f2e9bc2fdb53c5d4",
        },
      },
    ],
  },
  {
    theaterId: 1,
    slots: [
      {
        id: 0,
        value: "09:00 - 12:00",
        _id: {
          $oid: "64cdd777f2e9bc2fdb53c5d6",
        },
      },
      {
        id: 1,
        value: "12:30 - 15:30",
        _id: {
          $oid: "64cdd777f2e9bc2fdb53c5d7",
        },
      },
      {
        id: 2,
        value: "16:00 - 19:00",
        _id: {
          $oid: "64cdd777f2e9bc2fdb53c5d8",
        },
      },
      {
        id: 3,
        value: "19:30 - 22:30",
        _id: {
          $oid: "64cdd777f2e9bc2fdb53c5d9",
        },
      },
    ],
  },
  {
    theaterId: 2,
    slots: [
      {
        id: 0,
        value: "09:00 - 12:00",
        _id: {
          $oid: "64cdd777f2e9bc2fdb53c5db",
        },
      },
      {
        id: 1,
        value: "12:30 - 15:30",
        _id: {
          $oid: "64cdd777f2e9bc2fdb53c5dc",
        },
      },
      {
        id: 2,
        value: "16:00 - 17:45",
        _id: {
          $oid: "64cdd777f2e9bc2fdb53c5dd",
        },
      },
      {
        id: 3,
        value: "18:00 - 21:00",
        _id: {
          $oid: "64cdd777f2e9bc2fdb53c5de",
        },
      },
      {
        id: 4,
        value: "21:30 - 00:30",
        _id: {
          $oid: "64cdd777f2e9bc2fdb53c5df",
        },
      },
    ],
  },
];
module.exports = { pricingInfo, theaterType, decoration, decorationPrice, cakePricingInfo, cakeName, emailSubject, slotInfo };
