const NodeWebcam = require('node-webcam');

const opts = {
	width: 1024,
	height: 576,
	quality: 576,
	delay: 0,
	output: 'jpeg',
	device: false,
	callbackReturn: 'location',
	varbose: true,
}

const WebcamStream = NodeWebcam.create( opts );

module.exports = WebcamStream;


// ffmpeg -an -sn -s "1024x576" -r 24 -f "MJPEG"
