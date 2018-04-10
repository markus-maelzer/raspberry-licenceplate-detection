const cmd = require('node-cmd');
const fs = require('fs');
const _ = require('lodash');

const Webcam = require('./cam');
const checkNightTime  = require('./helpers/check-night-time');
const { db, bucket } = require('./firebase');

const HandleStream = require('./stream');
const stream = new HandleStream();

let settings;
// init settings + start Camera loop
db.settings.on('value', (snapshot) => {
  console.log(snapshot.val());
  settings = snapshot.val();
  checkCam(1000);
})

function checkStream() {
  if(settings.stopped && settings.stream) {
    stream.setStream();
  }
}

var camTimeout;
function checkCam(timeout) {
  clearInterval(camTimeout);
  if(settings.stopped) {
    checkStream();
    return false;
  } else {
    stream.killStream();
  }

  camTimeout = setTimeout(function () {
    if(checkNightTime()) {
      startCam();
    } else {
      checkCam(settings.interval.nighttime || 60000);
    }
  }, timeout);
}
function startCam() {
  Webcam.capture('image/plate', (err, data) => {
    console.log('Path', data);
    console.log('Error', err);
    if(data) {
      getPlate();
    }
  })
}


let curPlate = '';
const command = `alpr -c eu -n 3 -j ${__dirname}/image/plate.jpg`;

function getPlate() {
  cmd.get(
    command,
    (err, data, stderr) => {
      let parsedData = JSON.parse(data);
      console.log('Data:', parsedData);
      if(parsedData.results.length > 0) {
        const { plate } = parsedData.results[0];
        console.log('Plate:', plate);
        checkCam(settings.interval.success || 60000);
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
        checkCam(settings.interval.error || 30000);
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
