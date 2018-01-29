const RaspiCam = require('raspicam');
const request = require('request');
const cmd = require('node-cmd');
const fs = require('fs');

var cam = new RaspiCam({
  mode: "photo",
  output: `${__dirname}/test.jpg`,
  encoding: "jpg",
  timeout: 0
});
setInterval(() => {
  cam.start();
}, 5000);

// command[0] -> RASPBERRY
// command[1] -> windows
const command = [`alpr -c eu -j openalpr_64/samples/waut-1.jpg`, `cd openalpr_64 && alpr -c eu -j samples/aut-5.jpg`];

cam.on('read', (err, timestamp, filename) => {
  console.log(err, timestamp, filename);
})

function getPlate() {
  cmd.get(
    command[1],
    (err, data, stderr) => {
      var parsedData = JSON.parse(data);
      console.log(parsedData.results[0].plate);
    }
  );
}

getPlate();
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
