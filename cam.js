const RaspiCam = require('raspicam');

function createCam () {
  var cam = new RaspiCam({
    mode: "photo",
    output: ``,
    encoding: "jpg",
    timeout: 0
  });

  return function(callback) {
    cam.start();
    cam.on('start', function () {
      callback('cam')
    });
  }
}

module.exports = {
  createCam
}


// const cam = require('./helpers/camera');

// const takePic = cam.createCam();

// takePic((test) => {
//   console.log(test);
// })
