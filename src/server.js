var WebSocket = require('ws');
var messageTypes = require('./messaging').messageTypes;
var serverPort = require('./environment').SERVER_PORT;

module.exports.run = function() {
    console.log('Starting server on port ' + serverPort);

    const wss = new WebSocket.Server({
      port: serverPort,
      perMessageDeflate: {
        zlibDeflateOptions: {
          // See zlib defaults.
          chunkSize: 1024,
          memLevel: 7,
          level: 3
        },
        zlibInflateOptions: {
          chunkSize: 10 * 1024
        },
        // Other options settable:
        clientNoContextTakeover: true, // Defaults to negotiated value.
        serverNoContextTakeover: true, // Defaults to negotiated value.
        serverMaxWindowBits: 10, // Defaults to negotiated value.
        // Below options specified as default values.
        concurrencyLimit: 10, // Limits zlib concurrency for perf.
        threshold: 1024 // Size (in bytes) below which messages
        // should not be compressed.
      }
    });

    wss.on('connection', function connection(ws) {
        ws.on('message', function incoming(message) {
            if (message.forward) return;

            if (message.type === messageTypes.INIT) {
                console.log('Device ' + message.device + 'has joined');
            }
            
            // broadcast. Is this ok?
            ws.send(Object.assign(message, {
                forward: true
            }));
        });
    });
};