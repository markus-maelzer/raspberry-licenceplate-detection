const { db, bucket } = require('../firebase');
const io = require('socket.io-client');
const socket = io('http://localhost:3002', {reconnection: true});

const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');

const imagePath = path.join(__dirname, '../image/plate.jpg');
const watcherOptions = {
  awaitWriteFinish: {
    stabilityThreshold: 1000,
    pollInterval: 100
  }
};
const watcher = chokidar.watch(imagePath, watcherOptions)

socket.on('connect', () => {
  console.log('Connected', );
})
socket.on('disconnect', (data) => {
  console.log(data);
})

watcher.on('change', (path, status) => {
  // console.log(path, status);
  fs.readFile(path, (err, data) => {
    if(err) {
      console.log(err);
    }
    if(data) {
      console.log(data);
      socket.emit('image-stream', data)
    }
  })
})
