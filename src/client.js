serverUri = require('./environment').SERVER_URI || 'ws://localhost:8080';
device = require('./environment').DEVICE;
osc = require('osc');

var runMessage = {
    "origin":"S",
    "destination":"S",
    "ball": {
        "color":[255,0,0],
        "x":8,
        "y":1
    }
};

const oscPort = new osc.WebSocketPort({
	url: serverUri,
	metadata: true
  });
oscPort.open();

oscPort.on('message', function(oscMsg) {
	console.log(`Received ${oscMsg.args[0].value}`);
});

oscPort.on('ready', function() {
    oscPort.send({
        address: '/patata',
        args: [
            {
                type: 's',
                value: JSON.stringify(runMessage)
            }
        ]
	});	
});