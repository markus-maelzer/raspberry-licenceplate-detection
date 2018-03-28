const moment = require('moment');
function checkNightTime() {
  var now = moment();
  var wDay = now.weekday();
  if(wDay === 0) {
    return false;
  }

  var h = moment().hour();
  var m = moment().minute();

  if(wDay >= 2 && wDay <= 4) {
    if(h >= 17 || h < 8) {
      return false;
    }
  }

  if(wDay === 1) {
    if(h >= 17 && m >= 30 || h < 8) {
      return false;
    }
  }
  // check open times di-do

  if(wDay === 5) {
    if(h >= 17 && m >= 30 || h <= 7 && m >= 30) {
      return false;
    }
  }
  if(wDay === 6) {
    if(h >= 15 || h < 8) {
      return false;
    }
  }
  return true;
}

module.exports = checkNightTime;
