const RaspiCam = require('raspicam');
const request = require('request');
const cmd = require('node-cmd');
const fs = require('fs');

var cam = new RaspiCam({
  mode: "video",
  output: `${__dirname}/image/plate.jpg`,
  encoding: "jpg",
  timeout: 0,
  width: '1920',
  height: 1080
});

setInterval(() => {
  cam.start();
}, 10000);
cam.start();
// command[0] -> RASPBERRY
// command[1] -> windows
const command = [`alpr -c eu -j openalpr_64/samples/waut-1.jpg`, `cd openalpr_64 && alpr -c eu -j samples/aut-5.jpg`];

cam.on('read', (err, timestamp, filename) => {
  getPlate();
})

function getPlate() {
  cmd.get(
    command[0],
    (err, data, stderr) => {
      var parsedData = JSON.parse(data);
      console.log(parsedData.results[0].plate);
      cam.stop();
    }
  );
}

// getPlate();
// var test;
// // bims zu bad um function working zu mochn :c
// const getPlate = () => {
//   cmd.get(
//     `cd openalpr_64 && alpr -c eu -j samples/aut-5.jpg`,
//
//     function (err, data, stderr) {
//       console.log(JSON.parse(data));
//       res.send(JSON.parse(data.results))
//       // write test data to test.txt
//       // fs.appendFile('test.txt', data, function (err) {
//       //   console.log(err);
//       // })
//     }
//   )
// }



/*
try out creating objects with the itlab verwaltung/stundenplan
twoarray sth function

*/
