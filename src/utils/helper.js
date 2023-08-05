const moment = require("moment");

const getTodaysFormattedDate = () => {
  const todaysDate = moment().format("DD/MM/YYYY");
  const timeStamp = moment().unix();
  return { todaysDate, timeStamp };
};

module.exports = { getTodaysFormattedDate };
