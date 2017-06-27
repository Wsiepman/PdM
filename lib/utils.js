var fs = require('fs');
var fileName = './data/datautf8.txt';
var myLine = 1;

var msg = {
  "DeviceID": "",
  "DeviceName": "",
  "VESID": "1",
  "Type": "History",
  "Name": "",
  "Timestamp": "",
  "Flags": "0",
  "Unit": "m/s²",
  "Value": "0.0597948581",
  "Average": "",
  "Speed": "",
  "Reference": ""
}

var minmax = [
  { "name": "(1) Effective value (a)", "min": 0, "max": 10 },
  { "name": "(2) Effective value (a)", "min": 0, "max": 9 },
  { "name": "(3) Effective value (a)", "min": 0, "max": 6 },
  { "name": "(4) Effective value (a)", "min": 0, "max": 6 },
  { "name": "(IN 1) Upper Limit monitor", "min": 0.00500, "max": 0.00535 },
  { "name": "(IN 2) Upper Limit monitor", "min": 0.00487, "max": 0.00531 },
  { "name": "gE peak", "min": 0.0032, "max": 3.1762 },
  { "name": "gE rms", "min": 0.0137, "max": 4.9263 },
  { "name": "LowFreq", "min": 0.0001, "max": 0.9999 },
  { "name": "Vel_4k", "min": 0.0001, "max": 0.9999 }
]


function get_line(filename, line_no, callback) {
  var data = fs.readFileSync(fileName, 'utf8');
  var lines = data.split("\n");

  console.log('reading line: ' + line_no + ' of ' + lines.length) 

  if (+line_no > lines.length) {
    line_no = 0; //loop when reaching last line
  }

  callback(null, lines[+line_no]);
}

var composeMessage = function (deviceId, type) {
  msg.Timestamp = Date.now();

  if (type == 'replay') {
    get_line(fileName, myLine, function (err, line) {
      console.log('THE LINE: ' + line)
      var values = line.split(';')

      msg.DeviceID = values[0];
      msg.VESID = values[2];
      msg.Name = values[4];
      msg.Flags = values[6];
      msg.Value = values[8];
      msg.Average = values[9];
      msg.Speed = values[10];
      msg.Reference = values[11];
      myLine++;
    })
  }
  else {
    msg.Flags = Math.floor((Math.random() * 23));
    var index = Math.floor((Math.random() * 10));
    msg.Name = minmax[index].name;
    msg.Value = Math.random() * (minmax[index].max - minmax[index].min) + minmax[index].min;


    switch (msg.Name) {
      case "(IN 1) Upper Limit monitor":
        msg.VESID = 3;
        break;
      case "(IN 2) Upper Limit monitor":
        msg.VESID = 5;
        break;
      default:
        msg.VESID = Math.floor((Math.random() * 24));
        break;
    }
    if (msg.Name == "LowFreq" || msg.Name == "Vel_4k")
      msg.Unit = "m/s"
    else
      msg.Unit = "m/s²"

  }
  console.log('message: ' + JSON.stringify(msg))
  return msg;
}





module.exports.composeMessage = composeMessage;
