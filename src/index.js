const dotenv = require('dotenv');
dotenv.config();
var env = require('./environment');

console.log('Init device name ' + env.DEVICE);
if (!env.SERVER_URI) {
    var server = require('./server');
    server.run();
} else {
    console.log('Server uri is ' + env.SERVER_URI);
    console.log('Running as client');
    var app = require('./app');
    // this is already running
}