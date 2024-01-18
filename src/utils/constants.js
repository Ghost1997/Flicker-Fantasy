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
  blackForestRound: "Black Forest Round",
  blackForestHeart: "Black Forest Heart",
  butterScotchRound: "Butter Scotch Round",
  butterScotchHeart: "Butter Scotch Heart",
  chocolateRound: "Chocolate Round",
  chocolateHeart: "Chocolate Heart",
  pineAppleRound: "Pine Apple Round",
  pineAppleHeart: "Pine Apple Heart",
  buleBerryRound: "Blueberry Round",
  buleBerryHeart: "Blueberry Heart",
  mangoCakeRound: "Mango Cake Round",
  mangoCakeHeart: "Mango Cake Heart",
  roundRedVelvetRound: "Red Velvet Round",
  roundRedVelvetHeart: "Red Velvet Heart",
};

const decoration = {
  privateTheater: "Private Theater",
  birthday: "Surprise Birthday",
  anniversary: "Surprise Anniversary",
  momToBe: "Surprise Mom To Be",
  brideToBe: "Surprise Bride To Be",
  marriage: "Surprise Love/Marriage Proposal ",
};
const emailSubject = "Flicker Fantasy Order Confirmation";

const slotInfo = [
  {
    theaterId: 0,
    slots: [
      {
        id: 0,
        slotname: "09:30 AM - 12:30 PM",
        value: "09:30 - 12:30",
      },
      {
        id: 1,
        slotname: "01:00 PM - 04:00 PM",
        value: "13:00 - 16:00",
      },
      {
        id: 2,
        slotname: "04:30 PM - 07:00 PM",
        value: "16:30 - 19:00",
      },
      {
        id: 3,
        slotname: "07:30 PM - 10:00 PM",
        value: "19:30 - 22:00",
      },
      {
        id: 4,
        slotname: "10:30 PM - 01:00 AM",
        value: "22:30 - 01:00",
      },
    ],
  },
  {
    theaterId: 1,
    slots: [
      {
        id: 0,
        slotname: "09:30 AM - 12:30 PM",
        value: "09:30 - 12:30",
      },
      {
        id: 1,
        slotname: "01:00 PM - 04:00 PM",
        value: "13:00 - 16:00",
      },
      {
        id: 2,
        slotname: "04:30 PM - 07:00 PM",
        value: "16:30 - 19:00",
      },
      {
        id: 3,
        slotname: "07:30 PM - 10:00 PM",
        value: "19:30 - 22:00",
      },
      {
        id: 4,
        slotname: "10:30 PM - 01:00 AM",
        value: "22:30 - 01:00",
      },
    ],
  },
  {
    theaterId: 2,
    slots: [
      {
        id: 0,
        slotname: "09:30 AM - 12:30 PM",
        value: "09:30 - 12:30",
      },
      {
        id: 1,
        slotname: "01:00 PM - 04:00 PM",
        value: "13:00 - 16:00",
      },
      {
        id: 2,
        slotname: "04:30 PM - 07:00 PM",
        value: "16:30 - 19:00",
      },
      {
        id: 3,
        slotname: "07:30 PM - 10:00 PM",
        value: "19:30 - 22:00",
      },
      {
        id: 4,
        slotname: "10:30 PM - 01:00 AM",
        value: "22:30 - 01:00",
      },
    ],
  },
];
module.exports = { pricingInfo, theaterType, decoration, cakeName, emailSubject, slotInfo };
