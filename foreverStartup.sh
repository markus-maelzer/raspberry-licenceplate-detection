#!/bin/bash
sleep 8
cd /home/pi/raspberry-licenceplate-detection
forever start app.js >>/home/pi/output.log 2>>/home/pi/error.log
