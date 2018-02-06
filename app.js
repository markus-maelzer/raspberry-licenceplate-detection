const RaspiCam = require('raspicam');
const request = require('request');
const cmd = require('node-cmd');
const fs = require('fs');

const io = require('socket.io-client');
const socket = io.connect('http://c81ad749.ngrok.io', { reconnection: true});

socket.on('connect', () => {
  console.log('connected');
})

var cam = new RaspiCam({
  mode: "photo",
  output: `${__dirname}/image/plate.jpg`,
  encoding: "jpg",
  timeout: 5000,
  width: '1920',
  height: 1080,
});
// max-w: 3280
// max-h: 2464


function startCam(timeout) {
  setTimeout(function () {
    cam.start();
  }, timeout)
}
startCam(5000);


// command[0] -> RASPBERRY
// command[1] -> windows
const command = [`alpr -c eu -j image/plate.jpg`, `cd openalpr_64 && alpr -c eu -j samples/aut-5.jpg`];

cam.on('read', (err, timestamp, filename) => {
  console.log('read');
  getPlate();
})

function getPlate() {
  cmd.get(
    command[0],
    (err, data, stderr) => {
      var parsedData = JSON.parse(data);
      console.log('Data:', parsedData);
      if(parsedData.results.length > 0) {
        const { plate } = parsedData.results[0];
        console.log('Plate:', plate);
        startCam(30000);
        socket.emit('detection-success', {message: 'Sucess', data: parsedData, plate });
      } else {
        console.log('error');
        // request.post({url: ''})
        startCam(10000);
        fs.readFile('image/plate.jpg', (err, image) => {
          socket.emit('detection-error-image', { message: "No Plate detected", alprData: parsedData, image});
        })
      }
    }
  );
}
