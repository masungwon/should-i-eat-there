const uuidv4 = require("uuid/v4");

module.exports.currentDate = function currentDate() {
  return new Date(Date.now());
};

module.exports.getRandomUUID = function getRandomUUID() {
  return uuidv4();
};
