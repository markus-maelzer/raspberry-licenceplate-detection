const RaspiCam = require('raspicam');
const cmd = require('node-cmd');
const fs = require('fs');
const _ = require('lodash');
const moment = require('moment');

const { db, bucket } = require('./firebase');

// init cam
var cam = new RaspiCam({
  mode: "photo",
  output: `${__dirname}/image/plate.jpg`,
  encoding: "jpg",
  timeout: 3000,
  width: '1920',
  height: 1080,
});
// max-w: 3280
// max-h: 2464

let settings;
// init settings + start Camera loop
db.settings.on('value', (snapshot) => {
  console.log(snapshot.val());
  settings = snapshot.val();
  startCam(1000);
})

var camTimeout;
function startCam(timeout) {
  clearInterval(camTimeout);
  if(settings.stopped) {
    return false;
  }
  console.log('cam');
  camTimeout = setTimeout(function () {
    if(checkNightTime()) {
      cam.start();
    } else {
      startCam(settings.interval.nighttime || 60000);
    }
  }, timeout)
}


let curPlate = '';
const command = `alpr -c eu -n 3 -j image/plate.jpg`;

cam.on('read', (err, timestamp, filename) => {
  console.log('read');
  getPlate();
})

function getPlate() {
  cmd.get(
    command,
    (err, data, stderr) => {
      let parsedData = JSON.parse(data);
      console.log('Data:', parsedData);
      if(parsedData.results.length > 0) {
        const { plate } = parsedData.results[0];
        console.log('Plate:', plate);
        startCam(settings.interval.success || 60000);
        if(plate !== curPlate) {
          const newData = {
            message: 'Success',
            plate,
            ...pickFromSuccessData(parsedData)
          };
          db.success.push().set(newData);
          db.plate.set({ plate });
        }
      } else {
        console.log('error');
        startCam(settings.interval.error || 30000);
        const imageDestination = `error-images/image-${parsedData.epoch_time}.jpg`
        const newData = {
          image: imageDestination,
          message: 'the plate couldnt be recognized',
          ...pickFromErrorData(parsedData)
        }
        uploadImage(imageDestination);
        db.error.push().set(newData);
      }
    }
  );
}

function pickFromSuccessData(data) {
  let newData = _.pick(data, ['epoch_time', 'processing_time_ms', 'results']);
  newData.results = _.pick(data.results[0], ['plate', 'confidence', 'processing_time_ms', 'candidates']);

  return newData;
}

function pickFromErrorData(data) {
  return _.pick(data, ['epoch_time', 'processing_time_ms']);
}

function uploadImage(destination) {
  bucket.upload(`${__dirname}/image/plate.jpg`, {
    destination: destination,
    public: true,
    metadata: { contentType: 'image/jpg' }
  }).then((data) => {
    // console.log(`${JSON.stringify(data, undefined, 2)}`);
    console.log('Succesfully Uploaded');
  }).catch(e => {console.log(e);});
}

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
  }s
  if(wDay === 6) {
    if(h >= 15 || h < 8) {
      return false;
    }
  }
  return true;
}
console.log();
function nightSleep() {

}
