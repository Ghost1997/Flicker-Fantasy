const pricingInfo = {
  one: 1299,
  couple: 1199,
  two: 1299,
};

const theaterType = {
  0: "one",
  1: "two",
  2: "couple",
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
const advanceDecorationPrice = 500;
const decoration = [
  "Birthday",
  "Anniversary",
  "Romantic Date",
  "Marriage Proposal",
  "Bride To Be",
  "Farewell",
  "Congratulations",
  "Baby Shower",
  "Birthday-Advance",
  "Anniversary-Advance",
  "Romantic Date-Advance",
  "Marriage Proposal-Advance",
  "Bride To Be-Advance",
  "Farewell-Advance",
  "Congratulations-Advance",
  "Baby Shower-Advance",
];
const emailSubject = "Flicker Fantasy Order Confirmation";

const slotInfo = [
  {
    theaterId: 0,
    slots: [
      {
        id: 0,
        value: "09:30 - 12:30",
        _id: {
          $oid: "64cdd777f2e9bc2fdb53c5cd",
        },
      },
      {
        id: 1,
        value: "13:00 - 16:00",
        _id: {
          $oid: "64cdd777f2e9bc2fdb53c5ce",
        },
      },
      {
        id: 2,
        value: "16:15 - 19:15",
        _id: {
          $oid: "64cdd777f2e9bc2fdb53c5cf",
        },
      },
      {
        id: 3,
        value: "19:30 - 22:30",
        _id: {
          $oid: "64cdd777f2e9bc2fdb53c5d0",
        },
      },
      {
        id: 4,
        value: "22:30 - 01:30",
        _id: {
          $oid: "64cdd777f2e9bc2fdb53c5d1",
        },
      },
    ],
  },
  {
    theaterId: 1,
    slots: [
      {
        id: 0,
        value: "09:30 - 12:30",
        _id: {
          $oid: "64cdd777f2e9bc2fdb53c5d6",
        },
      },
      {
        id: 1,
        value: "13:00 - 16:00",
        _id: {
          $oid: "64cdd777f2e9bc2fdb53c5d7",
        },
      },
      {
        id: 2,
        value: "16:15 - 19:15",
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
      {
        id: 4,
        value: "22:30 - 01:30",
        _id: {
          $oid: "64cdd778f2e9bc2fdb53c5d9",
        },
      },
    ],
  },
  {
    theaterId: 2,
    slots: [
      {
        id: 0,
        value: "09:00 - 12:30",
        _id: {
          $oid: "64cdd777f2e9bc2fdb53c5db",
        },
      },
      {
        id: 1,
        value: "13:00- 14:00",
        _id: {
          $oid: "64cdd777f2e9bc2fdb53c5dc",
        },
      },
      {
        id: 2,
        value: "16:15 - 19:15",
        _id: {
          $oid: "64cdd777f2e9bc2fdb53c5dd",
        },
      },
      {
        id: 3,
        value: "19:30 - 23:30",
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
module.exports = { advanceDecorationPrice, pricingInfo, theaterType, decoration, decorationPrice, cakeName, emailSubject, slotInfo };
