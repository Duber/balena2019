serverUri = require('./environment').SERVER_URI || 'ws://10.10.169.145:8080';
device = require('./environment').DEVICE;
var WebSocket = require('ws');

var runMessage = {
    "origin":"S",
    "destination":"N",
    "ball": {
        "color":[0,255,0],
        "x":5,
        "y":-1
    }
};

const ws = new WebSocket(serverUri);

ws.on('open', function open() {
  ws.send(JSON.stringify(runMessage));
});

ws.on('message', function incoming(data) {
  console.log('Received message', data);
});