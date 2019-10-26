serverUri = require('./environment').SERVER_URI || 'ws://localhost:8080';
device = require('./environment').DEVICE;
var WebSocket = require('ws');

var runMessage = {
    "origin":"S",
    "destination":"S",
    "ball": {
        "color":[255,0,0],
        "x":8,
        "y":1
    }
};

const ws = new WebSocket(serverUri);

ws.on('open', function open() {
  ws.send(JSON.stringify(runMessage));
});

ws.on('message', function incoming(data) {
  console.log('Received message', data);
});