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
  timeout: 3000,
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
startCam(1000);


// command[0] -> RASPBERRY
// command[1] -> windows
const command = [`alpr -c eu -n 3 -j image/plate.jpg`, `cd openalpr_64 && alpr -c eu -j samples/aut-5.jpg`];

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
        const { processing_time_ms } = parsedData;
        console.log('Plate:', plate);
        startCam(30000);
        socket.emit('log-success', { message: 'Sucess', data: parsedData, plate });
        socket.emit('show-success', { plate });
      } else {
        console.log('error');
        // request.post({url: ''})
        startCam(10000);
        fs.readFile('image/plate.jpg', (err, image) => {
          socket.emit('log-error', { message: "No Plate detected", alprData: parsedData, image});
        })
      }
    }
  );
}
