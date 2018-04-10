const db = require('../firebase');
const child_process = require('child_process');

// const ffmpeg = child_process.spawn('ffmpeg', [
//   '-s', '320x240', '-i', '/dev/video0', '-f', 'mpegts',
//   '-codec:v', 'mpeg1video', '-b', '800k', '-r', '30',
//   'http://159.89.16.123:8081/supersecret'
// ])

class HandleStream {
  constructor() {
    this.ffmpeg;
    this.ffmpegArray = [
      '-s', '320x240', '-i', '/dev/video0', '-f', 'mpegts',
      '-codec:v', 'mpeg1video', '-b', '800k', '-r', '30',
      'http://159.89.16.123:8081/supersecret'
    ];
  }

  setStream() {
    console.log('set');
    this.ffmpeg = child_process.spawn('ffmpeg', this.ffmpegArray);

    this.ffmpeg.stdin.on('error', (e) => {
      console.log('FFmpeg STDIN Error', e);
    });

    this.ffmpeg.stderr.on('data', (data) => {
      console.log('FFmpeg STDERR:', data.toString());
    });
    this.ffmpeg.on('close', (code, signal) => {
      console.log('FFmpeg child process closed, code ' + code + ', signal ' + signal);
      this.ffmpeg.kill('SIGINT');
    });
  }
  killStream() {
    if(this.ffmpeg) {
      this.ffmpeg.kill('SIGINT');
      console.log('shutdown stream');
    } else {
      console.log('nothing');
    }
  }
}

module.exports = HandleStream;
