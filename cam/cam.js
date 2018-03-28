const NodeWebcam = require('node-webcam');

const opts = {
	width: 1920,
	height: 1080,
	quality: 100,
	delay: 0,
	output: 'jpeg',
	device: false,
	callbackReturn: 'location',
	varbose: true,
}

const Webcam = NodeWebcam.create( opts );
module.exports = Webcam;
